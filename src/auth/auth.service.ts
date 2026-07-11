import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTAccessOptions, JWTRefreshOptions } from '../global/config/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { TAuthUser, UserRole } from '../types/user';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { RedisService } from '../global/redis/redis.service';
import { normalizePhoneNumber } from '../utils/phone';
import { PurchasedCoursesService } from 'src/purchased-courses/purchased-courses.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private purchasedCourseService: PurchasedCoursesService,
  ) { }

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
    const normalizedPhone = normalizePhoneNumber(phone) || phone;
    const user = await this.prisma.user.findUnique({
      where: {
        phone: normalizedPhone,
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
      image: user.image,
      fullName: user.fullName,
      role: user.role
    };
  }

  async register(payload: RegisterDto, courseId: string) {
    const phone = normalizePhoneNumber(payload.phone);
    if (!phone) {
      throw new HttpException(
        'Telefon raqami noto\'g\'ri formatda',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (existingUser) {
      throw new HttpException(
        'Ushbu telefon raqami bilan foydalanuvchi allaqachon ro\'yxatdan o\'tgan',
        HttpStatus.BAD_REQUEST,
      );
    }

    const redisKey = `reg_${phone}`;
    const storedOtp = await this.redisService.get(redisKey);
    if (!storedOtp || storedOtp !== payload.otp) {
      throw new HttpException(
        'Noto\'g\'ri yoki muddati o\'tgan tasdiqlash kodi',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Delete OTP after successful verification to prevent reuse
    await this.redisService.del(redisKey);

    const hashedPassword = await hashPassword(payload.password);
    const user = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        password: hashedPassword,
        phone,
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

    const { course } = await this.purchasedCourseService.checkCoursePurchased(courseId, user.id);
    await this.prisma.purchasedCourse.create({
      data: {
        courseId,
        userId: user.id,
        amount: course.price,
      }
    })
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
    const phone = normalizePhoneNumber(payload.phone) || payload.phone;
    // await this.verificationService.checkConfirmOtp({
    //   type: EVerificationTypes.RESET_PASSWORD,
    //   otp: payload.otp,
    //   phone: payload.phone,
    // });
    const hashedPassword = await hashPassword(payload.password);
    await this.prisma.user.update({
      where: {
        phone,
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
