import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTAccessOptions, JWTRefreshOptions } from '../global/config/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { UserRole } from '../types/user';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(
    user: Pick<User, 'id' | 'phone'>,
    accessTokenOnly?: boolean,
  ) {
    const tokens = {
      accessToken: undefined,
      refreshToken: undefined,
    };

    tokens.accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        phone: user.phone,
      },
      JWTAccessOptions,
    );
    if (!accessTokenOnly) {
      tokens.refreshToken = await this.jwtService.signAsync(
        {
          id: user.id,
        },
        JWTRefreshOptions,
      );
    } else {
      delete tokens.refreshToken;
    }

    return tokens;
  }

  async validateUser(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { 
        phone,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (await checkPassword(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.phone, data.password);
    return {
      ...await this.generateTokens(user),
      role:user.role
    };
  }

  async register(payload: RegisterDto) {
    // await this.verificationService.checkConfirmOtp({
    //   type: EVerificationTypes.REGISTER,
    //   phone: payload.phone,
    //   otp: payload.otp,
    // });
    const hashedPassword = await hashPassword(payload.password);
    const user = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        password: hashedPassword,
        phone: payload.phone,
        role: UserRole.STUDENT,
      },
      select: {
        id: true,
        phone: true,
      },
    });
    await this.prisma.lastActivity.create({
      data: {
        userId: user.id,
      },
    });
    return this.generateTokens(user);
  }

  async refreshToken(payload: RefreshTokenDto) {
    try {
      const jwtPayload = await this.jwtService.verifyAsync<{ id: number }>(
        payload.token,
        JWTRefreshOptions,
      );
      const user = await this.prisma.user.findUnique({
        where: {
          id: jwtPayload.id,
        },
        select: {
          id: true,
          phone: true,
        },
      });
      if (!user) {
        throw new Error();
      }
      return this.generateTokens(user, true);
    } catch {
      throw new HttpException(
        'Invalid token or token expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    // await this.verificationService.checkConfirmOtp({
    //   type: EVerificationTypes.RESET_PASSWORD,
    //   otp: payload.otp,
    //   phone: payload.phone,
    // });
    const hashedPassword = await hashPassword(payload.password);
    await this.prisma.user.update({
      where: {
        phone: payload.phone,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      success: true,
      message: 'New password successfully set',
    };
  }
}
