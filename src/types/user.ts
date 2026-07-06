import { User } from '@prisma/client';

export enum UserRole {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  ASSISTANT = 'ASSISTANT',
  STUDENT = 'STUDENT',
  SUPER_ADMIN= 'SUPER_ADMIN'
}

export type TAuthUser = Omit<User, 'password'>;
