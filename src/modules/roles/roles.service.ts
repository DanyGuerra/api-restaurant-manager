import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/crear-rol.dto';
import { RolName } from 'src/types/roles';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find({ order: { id: 'ASC' } });
  }

  async getById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(dto: CreateRolDto): Promise<Role> {
    const role = this.roleRepository.create(dto);
    try {
      return await this.roleRepository.save(role);
    } catch (error) {
      if (error.code === '23505')
        // Postgres error code for unique violation
        throw new ConflictException('Role already exists');
      throw error;
    }
  }

  async update(id: number, dto: UpdateRolDto): Promise<Role> {
    const role = await this.getById(id);
    Object.assign(role, dto);
    return await this.roleRepository.save(role);
  }

  async getByName(name: RolName) {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      throw new NotFoundException(`Role with name "${name}" not found`);
    }
    return role;
  }

  async delete(id: number): Promise<void> {
    const role = await this.getById(id);
    await this.roleRepository.remove(role);
  }
}
