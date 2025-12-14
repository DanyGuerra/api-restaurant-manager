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

@Controller('order-item-options')
@UseGuards(JwtAuthGuard)
export class OrderItemOptionsController {
  constructor(private readonly orderItemOptionsService: OrderItemOptionsService) {}

  @Post()
  create(@Body() createOrderItemOptionDto: CreateOrderItemOptionDto) {
    return this.orderItemOptionsService.create(createOrderItemOptionDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemOptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderItemOptionDto: UpdateOrderItemOptionDto,
  ) {
    return this.orderItemOptionsService.update(id, updateOrderItemOptionDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemOptionsService.remove(id);
  }
}
