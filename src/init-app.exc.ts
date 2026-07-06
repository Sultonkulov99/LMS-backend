import { PrismaClient, UserRole } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { hashPassword } from './utils/bcrypt';
import { Logger } from '@nestjs/common';

(async () => {
  const prisma = new PrismaClient();
  const logger = new Logger();
  const superusers = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });
  if (!superusers) {
    const phone = process.env.APP_SUPERUSER_PHONE;
    const password = process.env.APP_SUPERUSER_PASSWORD;
    const hashedPass = await hashPassword(password);
    await prisma.user.create({
      data: {
        phone,
        password: hashedPass,
        fullName: 'Admin',
        role: UserRole.ADMIN,
      },
    });
    logger.log('Admin user created successfully!');
  }
  const uploadsPath = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    fs.mkdirSync(path.join(uploadsPath, 'public'));
    fs.mkdirSync(path.join(uploadsPath, 'private', 'files'), {
      recursive: true,
    });
    fs.mkdirSync(path.join(uploadsPath, 'private', 'videos'), {
      recursive: true,
    });
    logger.log('Uploads directory created!');
  }
})();
