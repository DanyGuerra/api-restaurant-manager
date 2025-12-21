import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserBusinessRolesService } from './user-business-role.service';
import { AssignRoleDto } from './dto/create-business-user-role.dto';
import { GetUserDto } from './dto/remove-user-business.dto';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-business-roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserBusinessRolesController {
  constructor(private readonly ubrService: UserBusinessRolesService) { }

  @Post()
  @Roles(RolName.OWNER)
  async assignRole(@Body() body: AssignRoleDto) {
    return this.ubrService.assignRole(body.user_id, body.business_id, body.role_id);
  }

  @Get('business/:id')
  @Roles(RolName.OWNER)
  async getRolesByBusiness(@Param('id') businessId: string) {
    return this.ubrService.findByBusiness(businessId);
  }

  @Get()
  @Roles(RolName.OWNER)
  async getRolesByBusinessAndUser(@Query() querys: GetUserDto) {
    return this.ubrService.findByBusinessAndUser(querys.user_id, querys.business_id);
  }

  @Patch()
  @Roles(RolName.OWNER)
  async updateRole(@Body() body: AssignRoleDto) {
    return this.ubrService.updateRole(body.user_id, body.business_id, body.role_id);
  }

  @Delete()
  @Roles(RolName.OWNER)
  async removeUserFromBusiness(@Body() body: GetUserDto) {
    return this.ubrService.removeUserFromBusiness(body.user_id, body.business_id);
  }
}
