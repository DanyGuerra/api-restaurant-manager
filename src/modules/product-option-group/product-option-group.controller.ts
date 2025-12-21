import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { CreateProductOptionGroupDto } from './dto/create-product-option-group.dto';
import { UpdateProductOptionGroupDto } from './dto/update-product-option-group.dto';
import { ProductOptionGroupService } from './product-option-group.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('product-option-group')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductOptionGroupController {
  constructor(private pogService: ProductOptionGroupService) { }

  @Post()
  @Roles(RolName.OWNER)
  create(@Body() createProductOptionGroup: CreateProductOptionGroupDto) {
    return this.pogService.create(createProductOptionGroup);
  }

  @Delete()
  @Roles(RolName.OWNER)
  delete(@Query() createProductOptionGroup: CreateProductOptionGroupDto) {
    return this.pogService.delete(createProductOptionGroup);
  }

  @Patch()
  @Roles(RolName.OWNER, RolName.ADMIN)
  update(@Body() updateDto: UpdateProductOptionGroupDto) {
    return this.pogService.update(updateDto);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getByProductId(
    @Param('id', new ParseUUIDPipe())
    productId: string,
  ) {
    return this.pogService.getAllByProductId(productId);
  }
}
