import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { seedSuperAdmin } from './seed/user.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await seedSuperAdmin(this.prisma);
  }
}