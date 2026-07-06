import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from '../database/prisma.service';
import { SmsService } from '../global/services/sms.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    PrismaService,
    SmsService,
    FilesService,
  ],
})
export class ProfileModule {}
