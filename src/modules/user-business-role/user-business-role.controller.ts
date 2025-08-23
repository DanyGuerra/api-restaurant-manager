import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ConflictException,
  Query,
} from '@nestjs/common';
import { UserBusinessRolesService } from './user-business-role.service';
import { AssignRoleDto } from './dto/create-business-user-role.dto';
import { GetUserDto } from './dto/remove-user-business.dto';
import { RolesService } from '../roles/roles.service';
import { RolName } from 'src/types/roles';

@Controller('user-business-roles')
export class UserBusinessRolesController {
  constructor(
    private readonly ubrService: UserBusinessRolesService,
    private readonly rolesService: RolesService,
  ) {}

  @Post()
  async assignRole(@Body() body: AssignRoleDto) {
    return this.ubrService.assignRole(
      body.user_id,
      body.business_id,
      body.role_id,
    );
  }

  @Get('business/:id')
  async getRolesByBusiness(@Param('id') businessId: string) {
    return this.ubrService.findByBusiness(businessId);
  }

  @Get()
  async getRolesByBusinessAndUser(@Query() querys: GetUserDto) {
    return this.ubrService.findByBusinessAndUser(
      querys.user_id,
      querys.business_id,
    );
  }

  @Patch()
  async updateRole(@Body() body: AssignRoleDto) {
    const { business_id, user_id, role_id } = body;

    return this.ubrService.updateRole(user_id, business_id, role_id);
  }

  @Delete()
  async removeUserFromBusiness(@Body() body: GetUserDto) {
    return this.ubrService.removeUserFromBusiness(
      body.user_id,
      body.business_id,
    );
  }
}
