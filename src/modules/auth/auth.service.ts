import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'src/core/database/prisma.service';
import { GenerateToken } from 'src/core/utils/jwt';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generateToken: GenerateToken,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { contact: dto.identifier },
        ],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Login or password wrong');
    }

    const accessToken = await this.generateToken.generateAccessToken(
      user.id as any,
      user.role,
    );
    const refreshToken = await this.generateToken.generateRefreshToken(
      user.id as any,
      user.role,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}