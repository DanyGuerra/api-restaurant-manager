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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Patch(':id')
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(id, updateProductDto);
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  getByProductId(@Body('id') id: string) {
    return this.productService.getByProductGroupId(id);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  deleteProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.deleteById(id);
  }
}
