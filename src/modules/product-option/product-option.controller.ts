import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ProductOptionService } from './product-option.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';

@Controller('product-option')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductOptionController {
  constructor(private productOptionService: ProductOptionService) { }

  @Post()
  @Roles(RolName.OWNER)
  create(@Body() createProductOptionDto: CreateProductOptionDto) {
    return this.productOptionService.create(createProductOptionDto);
  }

  @Patch(':id')
  @Roles(RolName.OWNER, RolName.ADMIN)
  update(
    @Body() updateOptioDto: UpdateProductOptionDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.productOptionService.update(updateOptioDto, id);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productOptionService.delete(id);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productOptionService.findOne(id);
  }
}
