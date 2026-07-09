import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TAuthUser, UserRole } from '../types/user';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { EVerificationTypes } from '../types/verification';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { validateFile } from '../files/validation/file-validation';
import { SetLastActivityDto } from './dto/set-last-activity.dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('api/my')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMe(@Request() req) {
    return req.user as TAuthUser;
  }

  @ApiOperation({ summary: `${UserRole.STUDENT }, ${UserRole.SUPER_ADMIN}`})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Get('last-activity')
  getLastActivity(@Request() req) {
    return this.profileService.getLastActivity(req.user as TAuthUser);
  }

  @ApiOperation({ summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}` })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Put('last-activity')
  setLastActivity(@Body() payload: SetLastActivityDto, @Request() req) {
    return this.profileService.setLastActivity(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: 'OTP verification',
    description: `Before you post you should send code with type=${EVerificationTypes.EDIT_PHONE} and verify it with verification endpoints.`,
  })
  @UseGuards(JwtAuthGuard)
  @Post('phone/update')
  changePhone(@Request() req, @Body() payload: UpdatePhoneDto) {
    const user: TAuthUser = req.user;
    return this.profileService.changePhone(payload, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch('profile')
  updateProfile(
    @Request() req,
    @Body() payload: UpdateProfileDto,
    @UploadedFile(validateFile({ type: 'image', size: 1 }))
    image?: Express.Multer.File,
  ) {
    const user: TAuthUser = req.user;
    return this.profileService.updateProfile(user, payload, image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password/update')
  updatePassword(@Request() req, @Body() payload: UpdatePasswordDto) {
    const user: TAuthUser = req.user;
    return this.profileService.updatePassword(user, payload);
  }

  @ApiOperation({ summary: `${UserRole.MENTOR},  ${UserRole.SUPER_ADMIN}` })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Patch('mentor-profile')
  updateMentorProfile(@Request() req, @Body() payload: UpdateMentorProfileDto) {
    const user: TAuthUser = req.user;
    return this.profileService.updateMentorProfile(user, payload);
  }
}
