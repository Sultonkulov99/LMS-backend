import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWTAccessOptions } from '../global/config/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SmsService } from '../global/services/sms.service';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWTAccessOptions.secret,
      signOptions: {
        expiresIn: JWTAccessOptions.expiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    JwtService,
    SmsService,
  ],
})
export class AuthModule {}
