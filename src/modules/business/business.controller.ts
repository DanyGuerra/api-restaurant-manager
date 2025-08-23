import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessService } from './business.service';
import { UsersService } from '../users/users.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('business')
export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private userService: UsersService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return this.businessService.getById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusiness: UpdateBusinessDto,
  ) {
    return this.businessService.updateBusiness(id, updateBusiness);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBusiness: CreateBusinessDto) {
    await this.userService.findById(createBusiness.owner_id);
    const business = await this.businessService.createBusiness(createBusiness);
    return await this.businessService.save(business);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return this.businessService.getAll();
  }
}
