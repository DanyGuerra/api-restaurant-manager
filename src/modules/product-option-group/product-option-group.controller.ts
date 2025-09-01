import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { CreateProductOptionGroupDto } from './dto/create-product-option-group.dto';
import { ProductOptionGroupService } from './product-option-group.service';

@Controller('product-option-group')
@UseGuards(JwtAuthGuard)
export class ProductOptionGroupController {
  constructor(private pogService: ProductOptionGroupService) {}

  @Post()
  @Roles(RolName.OWNER)
  create(@Body() createProductOptionGroup: CreateProductOptionGroupDto) {
    return this.pogService.create(createProductOptionGroup);
  }

  @Get(':id')
  getByProductId(
    @Param('id', new ParseUUIDPipe())
    productId: string,
  ) {
    return this.pogService.getAllByProductId(productId);
  }
}
