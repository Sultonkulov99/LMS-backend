import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../types/user';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);
