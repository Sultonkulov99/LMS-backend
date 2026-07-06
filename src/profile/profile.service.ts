import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { TAuthUser } from '../types/user';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FilesService } from '../files/files.service';
import { EFileType } from '../types/files';
import { User } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { SetLastActivityDto } from './dto/set-last-activity.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  getLastActivity(authUser: TAuthUser) {
    return this.prisma.lastActivity.findUnique({
      where: { userId: authUser.id },
    });
  }

  setLastActivity(payload: SetLastActivityDto, authUser: TAuthUser) {
    return this.prisma.lastActivity.update({
      where: {
        userId: authUser.id,
      },
      data: payload,
    });
  }

  async changePhone(payload: UpdatePhoneDto, authUser: TAuthUser) {
    // await this.verificationService.checkConfirmOtp({
    //   type: EVerificationTypes.EDIT_PHONE,
    //   phone: payload.phone,
    //   otp: payload.otp,
    // });

    await this.prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        phone: payload.phone,
      },
    });
    return {
      success: true,
      message: 'Phone updated successfully!',
    };
  }

  async updateProfile(
    authUser: TAuthUser,
    payload: UpdateProfileDto,
    image?: Express.Multer.File,
  ) {
    const data: Pick<User, 'fullName' | 'image'> = {
      image: null,
      fullName: payload.fullName,
    };

    if (image) {
      data.image = await this.filesService.saveFile(
        image,
        EFileType.PUBLIC_FILE,
      );
      if (authUser.image) {
        this.filesService.deleteFile(authUser.image, EFileType.PUBLIC_FILE);
      }
    }

    await this.prisma.user.update({
      where: {
        id: authUser.id,
      },
      data,
    });

    return data;
  }

  async updatePassword(authUser: TAuthUser, payload: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        password: true,
      },
    });

    const isPasswordValid = await checkPassword(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Current password invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hashPassword(payload.newPassword);
    await this.prisma.user.update({
      where: { id: authUser.id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'New password set',
    };
  }

  async updateMentorProfile(
    authUser: TAuthUser,
    payload: UpdateMentorProfileDto,
  ) {
    const profile = await this.prisma.mentorProfile.findUnique({
      where: { userId: authUser.id },
    });
    if (!profile) {
      throw new NotFoundException('Mentor Profile not found');
    }
    return this.prisma.mentorProfile.update({
      where: { userId: authUser.id },
      data: {
        about: payload?.about || profile.about,
        job: payload?.job || profile.job,
        experience: payload?.experience || profile.experience,
        telegram: payload?.telegram || profile.telegram,
        instagram: payload?.instagram || profile.instagram,
        facebook: payload?.facebook || profile.facebook,
        linkedin: payload?.linkedin || profile.linkedin,
        github: payload?.github || profile.github,
        website: payload?.website || profile.website,
      },
    });
  }
}
