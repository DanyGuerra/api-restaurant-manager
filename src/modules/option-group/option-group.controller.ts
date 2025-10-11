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
@UseGuards(JwtAuthGuard)
export class OptionGroupController {
  constructor(private optionGroupService: OptionGroupService) {}

  @Post()
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  create(
    @BusinessIdHeader() businessId: string,
    @Body() createOptionGroup: CreateOptionGroup,
  ) {
    return this.optionGroupService.create(createOptionGroup, businessId);
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.optionGroupService.getById(id);
  }

  @Get('business/:businessId')
  getByBusinessId(@Param('businessId', new ParseUUIDPipe()) id: string) {
    return this.optionGroupService.getByBusinessId(id);
  }

  @Patch(':id')
  updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOptionGroup: UpdateOptionGroup,
  ) {
    return this.optionGroupService.updateById(id, updateOptionGroup);
  }

  @Delete(':id')
  deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.optionGroupService.deleteById(id);
  }
}
