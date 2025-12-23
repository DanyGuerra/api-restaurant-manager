import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBusinessRole } from 'entities/user-business-role.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserBusinessRolesService {
  constructor(
    @InjectRepository(UserBusinessRole)
    private readonly ubrRepository: Repository<UserBusinessRole>,
    private readonly usersService: UsersService,
  ) { }

  async assignRole(userId: string, businessId: string, roleId: number) {
    const relation = this.ubrRepository.create({
      user_id: userId,
      business_id: businessId,
      role_id: roleId,
    });

    return this.ubrRepository.save(relation);
  }

  async assignRoleByEmail(email: string, businessId: string, roleId: number) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("Invalid user email");
    }

    const existingRole = await this.ubrRepository.findOne({
      where: { user_id: user.id, business_id: businessId },
    });

    if (existingRole) {
      throw new BadRequestException('User already has a role in this business');
    }

    return this.assignRole(user.id, businessId, roleId);
  }

  async findByBusiness(businessId: string) {
    return this.ubrRepository.find({
      where: { business_id: businessId },
      relations: ['user', 'role'],
      select: {
        user: {
          id: true,
          email: true,
          name: true,
        },
      },
    });
  }

  async findByBusinessAndUser(userId: string, businessId: string) {
    const userRol = await this.ubrRepository.find({
      where: { user_id: userId, business_id: businessId },
      relations: ['role'],
    });

    if (!userRol || userRol.length === 0) {
      throw new NotFoundException('Not found');
    }

    return userRol;
  }

  async updateRole(userId: string, businessId: string, roleId: number) {
    const relation = await this.ubrRepository.findOne({
      where: { user_id: userId, business_id: businessId },
      relations: ['role'],
    });

    if (!relation) throw new NotFoundException('Relation not found');

    if (relation.role.name === 'OWNER') {
      throw new ConflictException('Cannot modify user with OWNER role');
    }

    relation.role_id = roleId;
    return this.ubrRepository.save(relation);
  }

  async removeUserFromBusiness(userId: string, businessId: string) {
    const relations = await this.ubrRepository.find({
      where: { user_id: userId, business_id: businessId },
      relations: ['role'],
    });

    if (!relations || relations.length === 0) {
      throw new NotFoundException('Relations not found');
    }

    const rolesToRemove = relations.filter((r) => r.role.name !== 'OWNER');

    if (rolesToRemove.length === 0) {
      throw new ConflictException('Cannot remove any role (only OWNER exists)');
    }

    const removed = await Promise.all(
      rolesToRemove.map((r) =>
        this.ubrRepository.delete({
          user_id: r.user_id,
          business_id: r.business_id,
          role_id: r.role_id,
        }),
      ),
    );

    return removed;
  }
}
