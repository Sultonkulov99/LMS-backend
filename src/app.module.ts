import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FilesModule } from './files/files.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { PurchasedCoursesModule } from './purchased-courses/purchased-courses.module';
import { ExamsModule } from './exams/exams.module';
import { UsersModule } from './users/users.module';
import { HomeworkModule } from './homework/homework.module';
import { ContactModule } from './contact/contact.module';
import { QuestionsModule } from './questions/questions.module';
import { CacheModuleConfig } from './global/config/cache-module.config';
import { PrismaModule } from './core/database/prisma.module';
import { SeederModule } from './core/seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheModuleConfig,
    }),
    AuthModule,
    ProfileModule,
    CoursesModule,
    PurchasedCoursesModule,
    LessonsModule,
    ExamsModule,
    HomeworkModule,
    QuestionsModule,
    UsersModule,
    PrismaModule,
    ContactModule,
    FilesModule,
    SeederModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
