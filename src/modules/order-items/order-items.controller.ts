import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Controller('order-items')
export class OrderItemsController {
    constructor(private readonly orderItemsService: OrderItemsService) { }

    @Post()
    create(@Body() createOrderItemDto: CreateOrderItemDto) {
        return this.orderItemsService.create(createOrderItemDto);
    }

    @Get('by-group-id/:orderItemGroupId')
    findAllByOrderItemGroupId(@Param('orderItemGroupId', new ParseUUIDPipe()) orderItemGroupId: string) {
        return this.orderItemsService.findAllByOrderItemGroupId(orderItemGroupId);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderItemsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOrderItemDto: UpdateOrderItemDto) {
        return this.orderItemsService.update(id, updateOrderItemDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderItemsService.remove(id);
    }
}
