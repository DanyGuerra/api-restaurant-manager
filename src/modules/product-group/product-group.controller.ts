import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { ProductGroupService } from './product-group.service';
import { RolesGuard } from '../auth/roles.guard';
import { businessIdHeader } from 'src/types/headers';
import { UpdateProductGroupDto } from './dto/udpate-product-group,dto';

@Controller('product-group')
@UseGuards(JwtAuthGuard)
export class ProductGroupController {
  constructor(private productGroupService: ProductGroupService) {}

  @Post()
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  createProductGroup(@Body() createProductGroup: CreateProductGroupDto) {
    return this.productGroupService.create(createProductGroup);
  }

  @Get()
  getByBusinessId(@Headers(businessIdHeader) id: string) {
    return this.productGroupService.getByBusinessId(id);
  }

  @Get(':id')
  getByProductGroupId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productGroupService.getByProductGroupId(id);
  }

  @Patch(':id')
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  updateProductGroupById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductGroup: UpdateProductGroupDto,
  ) {
    return this.productGroupService.updateProductGroupById(
      id,
      updateProductGroup,
    );
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  @UseGuards(RolesGuard)
  deleteProductGroupById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productGroupService.deleteProductGroupById(id);
  }
}
