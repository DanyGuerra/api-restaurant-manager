import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessService } from './business.service';
import { UsersService } from '../users/users.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Roles } from '../auth/roles.decorator';
import { RolId, RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { UserBusinessRolesService } from '../user-business-role/user-business-role.service';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';

@Controller('business')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private userBusinessRolesService: UserBusinessRolesService,
    private userService: UsersService,
  ) { }

  @Get('owner')
  async getByUserId(@Req() req: any) {
    const userId = req.user.sub;
    return this.businessService.getByUserId(userId);
  }

  @Get('products')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getFullBusiness(@BusinessIdHeader() id: string) {
    return this.businessService.getBusinessFullStructure(id);
  }

  @Get()
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  async getById(@BusinessIdHeader() id: string) {
    return this.businessService.getById(id);
  }

  @Put()
  @Roles(RolName.OWNER, RolName.ADMIN)
  updateBusiness(@BusinessIdHeader() id: string, @Body() updateBusiness: UpdateBusinessDto) {
    return this.businessService.updateBusiness(id, updateBusiness);
  }

  @Post()
  async create(@Body() createBusiness: CreateBusinessDto, @Req() req: any) {
    const userId = req.user.sub;
    await this.userService.findById(userId);
    const business = await this.businessService.createBusiness(createBusiness, userId);
    await this.userBusinessRolesService.assignRole(userId, business.id, RolId.OWNER);

    return await this.businessService.save(business);
  }

  @Delete()
  @Roles(RolName.OWNER)
  delete(@BusinessIdHeader() id: string) {
    return this.businessService.deleteById(id);
  }
}
