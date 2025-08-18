import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRolDto } from './dto/crear-rol.dto';
import { Role } from 'entities/role.entity';
import { UpdateRolDto } from './dto/update-rol.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string): Promise<Role> {
    return this.rolesService.getById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateRolDto): Promise<Role> {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRolDto,
  ): Promise<Role> {
    return this.rolesService.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.rolesService.delete(Number(id));
  }
}
