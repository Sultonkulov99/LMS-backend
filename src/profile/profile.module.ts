import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SmsService } from '../global/services/sms.service';
import { FilesService } from '../files/files.service';
import { PrismaService } from 'src/core/database/prisma.service';

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
