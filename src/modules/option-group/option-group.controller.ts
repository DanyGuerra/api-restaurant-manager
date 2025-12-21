import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateOptionGroup } from './dto/create-option-group.dto';
import { OptionGroupService } from './option-group.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateOptionGroup } from './dto/update-option-group.dto';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';

@Controller('option-group')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OptionGroupController {
  constructor(private optionGroupService: OptionGroupService) { }

  @Post()
  @Roles(RolName.OWNER)
  create(@BusinessIdHeader() businessId: string, @Body() createOptionGroup: CreateOptionGroup) {
    return this.optionGroupService.create(createOptionGroup, businessId);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.optionGroupService.getById(id);
  }

  @Get('business/:businessId')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getByBusinessId(
    @Param('businessId', new ParseUUIDPipe()) id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.optionGroupService.getByBusinessId(id, page, limit, search);
  }

  @Patch(':id')
  @Roles(RolName.OWNER, RolName.ADMIN)
  updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOptionGroup: UpdateOptionGroup,
  ) {
    return this.optionGroupService.updateById(id, updateOptionGroup);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.optionGroupService.deleteById(id);
  }
}
