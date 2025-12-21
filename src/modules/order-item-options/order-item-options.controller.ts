import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrderItemOptionsService } from './order-item-options.service';
import { CreateOrderItemOptionDto } from './dto/create-order-item-option.dto';
import { UpdateOrderItemOptionDto } from './dto/update-order-item-option.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';

@Controller('order-item-options')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderItemOptionsController {
  constructor(private readonly orderItemOptionsService: OrderItemOptionsService) { }

  @Post()
  @Roles(RolName.OWNER)
  create(@Body() createOrderItemOptionDto: CreateOrderItemOptionDto) {
    return this.orderItemOptionsService.create(createOrderItemOptionDto);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemOptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolName.OWNER, RolName.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderItemOptionDto: UpdateOrderItemOptionDto,
  ) {
    return this.orderItemOptionsService.update(id, updateOrderItemOptionDto);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemOptionsService.remove(id);
  }
}
