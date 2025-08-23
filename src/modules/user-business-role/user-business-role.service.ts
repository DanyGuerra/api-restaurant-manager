import { UserBusinessRole } from 'entities/user-business-role.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserBusinessRolesService {
  constructor(
    @InjectRepository(UserBusinessRole)
    private readonly ubrRepository: Repository<UserBusinessRole>,
  ) {}

  async assignRole(userId: string, businessId: string, roleId: number) {
    const relation = this.ubrRepository.create({
      user_id: userId,
      business_id: businessId,
      role_id: roleId,
    });

    return this.ubrRepository.save(relation);
  }

  async findByBusiness(businessId: string) {
    return this.ubrRepository.find({
      where: { business_id: businessId },
      relations: ['role'],
    });
  }

  async findByBusinessAndUser(userId: string, businessId: string) {
    const userRol = await this.ubrRepository.find({
      where: { user_id: userId, business_id: businessId },
      relations: ['role'],
    });

    if (!userRol) {
      throw new NotFoundException('Not found');
    }

    return userRol;
  }

  async updateRole(userId: string, businessId: string, roleId: number) {
    const relation = await this.ubrRepository.findOne({
      where: { user_id: userId, business_id: businessId },
    });

    if (!relation) throw new NotFoundException('Relation not found');

    relation.role_id = roleId;
    return this.ubrRepository.save(relation);
  }

  async removeUserFromBusiness(userId: string, businessId: string) {
    await this.ubrRepository.delete({
      user_id: userId,
      business_id: businessId,
    });
    return { message: 'User removed from business' };
  }
}
