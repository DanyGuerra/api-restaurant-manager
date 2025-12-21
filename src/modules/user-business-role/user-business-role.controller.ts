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
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';

@Controller('user-business-roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserBusinessRolesController {
  constructor(private readonly ubrService: UserBusinessRolesService) { }

  @Post("user/:id")
  @Roles(RolName.OWNER)
  async assignRole(@BusinessIdHeader() businessId: string, @Param('id') userId: string, @Body() body: AssignRoleDto) {
    return this.ubrService.assignRole(userId, businessId, body.role_id);
  }

  @Get()
  @Roles(RolName.OWNER)
  async getRolesByBusiness(@BusinessIdHeader() businessId: string) {
    return this.ubrService.findByBusiness(businessId);
  }

  @Get("user/:id")
  @Roles(RolName.OWNER)
  async getRolesByBusinessAndUser(@BusinessIdHeader() businessId: string, @Param('id') userId: string) {
    return this.ubrService.findByBusinessAndUser(userId, businessId);
  }

  @Delete("user/:id")
  @Roles(RolName.OWNER)
  async removeUserFromBusiness(@BusinessIdHeader() businessId: string, @Param('id') userId: string) {
    return this.ubrService.removeUserFromBusiness(userId, businessId);
  }
}
