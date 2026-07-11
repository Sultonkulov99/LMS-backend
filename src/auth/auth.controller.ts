import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EVerificationTypes } from '../types/verification';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @ApiOperation({
    description:
      'Create user and get tokens. You should send register type verification & verify that before register.',
    summary: 'OTP verification',
  })
  @Post('register')
  register(@Body() payload: RegisterDto, @Query('courseId') courseId: string) {
    return this.authService.register(payload, courseId);
  }

  @Post('refresh-token')
  refreshToken(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshToken(payload);
  }

  @ApiOperation({
    description: `First you should send code with type=${EVerificationTypes.RESET_PASSWORD} & verify it.`,
    summary: 'OTP verification',
  })
  @Post('reset-password')
  resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }
}
