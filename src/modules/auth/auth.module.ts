import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenModule } from 'src/core/utils/jwt.module';

@Module({
  imports: [JwtTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

