import { SetMetadata } from '@nestjs/common';
import { RolName } from 'src/types/roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolName[]) => SetMetadata(ROLES_KEY, roles);
