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
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';

@Controller('order-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) { }

  @Post()
  @Roles(RolName.OWNER)
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get('by-group-id/:orderItemGroupId')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findAllByOrderItemGroupId(
    @Param('orderItemGroupId', new ParseUUIDPipe()) orderItemGroupId: string,
  ) {
    return this.orderItemsService.findAllByOrderItemGroupId(orderItemGroupId);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolName.OWNER, RolName.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemsService.remove(id);
  }
}
