import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWTAccessOptions } from '../global/config/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/core/database/prisma.service';
import { PurchasedCoursesModule } from 'src/purchased-courses/purchased-courses.module';
import { PurchasedCoursesService } from 'src/purchased-courses/purchased-courses.service';

@Module({
  imports: [
    PassportModule,
    PurchasedCoursesModule,
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
    PurchasedCoursesService,
    JwtStrategy,
    JwtService,
  ],
})
export class AuthModule {}
