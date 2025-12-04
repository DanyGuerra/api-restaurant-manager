import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrderItemOptionsService } from './order-item-options.service';
import { CreateOrderItemOptionDto } from './dto/create-order-item-option.dto';
import { UpdateOrderItemOptionDto } from './dto/update-order-item-option.dto';

@Controller('order-item-options')
export class OrderItemOptionsController {
    constructor(private readonly orderItemOptionsService: OrderItemOptionsService) { }

    @Post()
    create(@Body() createOrderItemOptionDto: CreateOrderItemOptionDto) {
        return this.orderItemOptionsService.create(createOrderItemOptionDto);
    }

    @Get()
    findAll() {
        return this.orderItemOptionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderItemOptionsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOrderItemOptionDto: UpdateOrderItemOptionDto) {
        return this.orderItemOptionsService.update(id, updateOrderItemOptionDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderItemOptionsService.remove(id);
    }
}
