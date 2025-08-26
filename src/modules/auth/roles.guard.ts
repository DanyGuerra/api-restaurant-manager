import { RolName } from 'src/types/roles';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserBusinessRole)
    private readonly ubrRepo: Repository<UserBusinessRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const businessId = request.headers['x-business-id'];

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    if (!businessId) {
      throw new ForbiddenException('Business ID is required in headers');
    }

    const relation = await this.ubrRepo.findOne({
      where: { user_id: user.sub, business_id: businessId },
      relations: ['role'],
    });

    if (!relation) {
      throw new ForbiddenException('You do not have a role in this business');
    }

    // Validar si el rol del usuario está en los permitidos
    const hasRole = requiredRoles.includes(relation.role.name as RolName);
    if (!hasRole) {
      throw new ForbiddenException(
        `You need one of the roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
