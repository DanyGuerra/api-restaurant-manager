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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { RolesGuard } from '../auth/roles.guard';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productService: ProductsService) { }

  @Post()
  @Roles(RolName.OWNER)
  createProduct(@Body() createProductDto: CreateProductDto[]) {
    return this.productService.createProduct(createProductDto);
  }

  @Patch(':id')
  @Roles(RolName.OWNER, RolName.ADMIN)
  updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(id, updateProductDto);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getByProductId(@Query('product_group_id', new ParseUUIDPipe()) id: string) {
    return this.productService.getByProductGroupId(id);
  }

  @Get('business/:id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  getProductsByBusinessId(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.productService.getProductsByBusinessId(id, page, limit, search);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  deleteProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.deleteById(id);
  }
}
