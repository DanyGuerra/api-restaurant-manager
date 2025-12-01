import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';
import { OrderItemGroupsService } from './order-item-groups.service';
import { CreateOrderItemGroupDto } from './dto/create-order-item-group.dto';
import { UpdateOrderItemGroupDto } from './dto/update-order-item-group.dto';

@Controller('order-item-groups')
export class OrderItemGroupsController {
    constructor(private readonly orderItemGroupsService: OrderItemGroupsService) { }

    @Post()
    create(@Body() createOrderItemGroupDto: CreateOrderItemGroupDto) {
        return this.orderItemGroupsService.create(createOrderItemGroupDto);
    }

    @Get('business')
    findAllByBusinessId(@BusinessIdHeader() businessId: string) {
        return this.orderItemGroupsService.findAllByBusinessId(businessId);
    }

    @Get('order/:orderId')
    findAllByOrderId(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
        return this.orderItemGroupsService.findAllByOrderId(orderId);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderItemGroupsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOrderItemGroupDto: UpdateOrderItemGroupDto) {
        return this.orderItemGroupsService.update(id, updateOrderItemGroupDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.orderItemGroupsService.remove(id);
    }
}
