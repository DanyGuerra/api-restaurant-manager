import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateFullOrderDto } from './dto/create-full-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto, @Req() req: any, @BusinessIdHeader() businessId: string,) {
        const userId = req.user.sub;
        return this.ordersService.create(createOrderDto, userId, businessId);
    }

    @Post('full')
    createFull(
        @Body(new ParseArrayPipe({ items: CreateFullOrderDto })) createOrderDto: CreateFullOrderDto[],
        @Req() req: any,
        @BusinessIdHeader() businessId: string
    ) {
        const userId = req.user.sub;
        return this.ordersService.createFullOrder(createOrderDto, userId, businessId);
    }

    @Get('by-business-id')
    findByBusinessId(@BusinessIdHeader() businessId: string) {
        return this.ordersService.findByBusinessId(businessId);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ordersService.remove(id);
    }
}
