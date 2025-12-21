import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRolDto } from './dto/crear-rol.dto';
import { Role } from 'entities/role.entity';
import { UpdateRolDto } from './dto/update-rol.dto';
import { RolName } from 'src/types/roles';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @Get('get-byname')
  async getByName(@Query() query: CreateRolDto) {
    return this.rolesService.getByName(query.name);
  }

  @Get()
  async getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Role> {
    return this.rolesService.getById(Number(id));
  }

  @Post()
  async create(@Body() dto: CreateRolDto): Promise<Role> {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRolDto): Promise<Role> {
    return this.rolesService.update(Number(id), dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.rolesService.delete(Number(id));
  }
}
