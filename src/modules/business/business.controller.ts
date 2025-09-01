import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessService } from './business.service';
import { UsersService } from '../users/users.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Roles } from '../auth/roles.decorator';
import { RolId, RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { UserBusinessRolesService } from '../user-business-role/user-business-role.service';
import { businessIdHeader, userIdHeader } from 'src/types/headers';

@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private userBusinessRolesService: UserBusinessRolesService,
    private userService: UsersService,
  ) {}

  @Get('owner')
  async getByOwnerId(@Headers(userIdHeader) id: string) {
    return this.businessService.getByOwnerId(id);
  }

  @Get('products')
  getFullBusiness(@Headers(businessIdHeader) id: string) {
    return this.businessService.getBusinessFullStructure(id);
  }

  @Get()
  async getById(@Headers(businessIdHeader) id: string) {
    return this.businessService.getById(id);
  }

  @Put()
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  updateBusiness(
    @Headers(businessIdHeader) id: string,
    @Body() updateBusiness: UpdateBusinessDto,
  ) {
    return this.businessService.updateBusiness(id, updateBusiness);
  }

  @Post()
  async create(@Body() createBusiness: CreateBusinessDto) {
    await this.userService.findById(createBusiness.owner_id);
    const business = await this.businessService.createBusiness(createBusiness);
    await this.userBusinessRolesService.assignRole(
      createBusiness.owner_id,
      business.id,
      RolId.OWNER,
    );

    return await this.businessService.save(business);
  }

  @Get()
  getAll() {
    return this.businessService.getAll();
  }

  @Delete()
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  delete(@Headers(businessIdHeader) id: string) {
    return this.businessService.deleteById(id);
  }
}
