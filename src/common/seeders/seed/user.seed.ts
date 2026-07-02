import { PrismaService } from 'src/core/database/prisma.service';
import { Roles, Status } from '@prisma/client';
import * as argon from 'argon2';
import { Logger } from '@nestjs/common';

export async function seedSuperAdmin(prisma: PrismaService): Promise<void> {
  const contact = process.env.SUPERADMIN_CONTACT!;
  const email = process.env.SUPERADMIN_EMAIL!;
  const password = process.env.SUPERADMIN_PASSWORD!;


  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { contact }],
    },
  });

  if (exists) {
    Logger.log("⚠️  Superadmin allaqachon mavjud, o'tkazib yuborildi.", 'UserSeed');
    return;
  }

  const hashedPassword = await argon.hash(password);

  await prisma.user.create({
    data: {
      fullname: 'Super Admin',
      email,
      contact,
      password: hashedPassword,
      role: Roles.SUPERADMIN,
      status: Status.ACTIVE,
      photo: null,
    },
  });

  Logger.log('✅ Superadmin muvaffaqiyatli yaratildi.', 'UserSeed');
}
