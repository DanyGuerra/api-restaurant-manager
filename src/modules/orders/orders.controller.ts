import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    Req,
    UseGuards,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
    ParseEnumPipe,
    Put,
    ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateFullOrderDto } from './dto/create-full-order.dto';
import { UpdateFullOrderDto } from './dto/update-full-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';
import { ConsumptionType, OrderStatus } from 'src/types/order';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
    create(
        @Body() createOrderDto: CreateOrderDto,
        @Req() req: any,
        @BusinessIdHeader() businessId: string,
    ) {
        const userId = req.user.sub;
        return this.ordersService.create(createOrderDto, userId, businessId);
    }

    @Post('full')
    @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
    createFull(
        @Body() createOrderDto: CreateFullOrderDto,
        @Req() req: any,
        @BusinessIdHeader() businessId: string,
    ) {
        const userId = req.user.sub;
        return this.ordersService.createFullOrder(
            createOrderDto,
            userId,
            businessId,
        );
    }
    @Put('full/:id')
    @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
    updateFull(
        @Param('id') id: string,
        @Body() updateFullOrderDto: UpdateFullOrderDto,
        @BusinessIdHeader() businessId: string,
    ) {
        return this.ordersService.updateFullOrder(
            id,
            updateFullOrderDto,
            businessId,
        );
    }

    @Get('by-business-id')
    @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
    findByBusinessId(
        @BusinessIdHeader() businessId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('status', new ParseEnumPipe(OrderStatus, { optional: true }))
        status?: OrderStatus,
        @Query(
            'consumption_type',
            new ParseEnumPipe(ConsumptionType, { optional: true }),
        )
        consumption_type?: ConsumptionType,
        @Query('sort', new DefaultValuePipe('ASC')) sort?: 'ASC' | 'DESC',
        @Query('start_date') start_date?: string,
        @Query('end_date') end_date?: string,
    ) {
        return this.ordersService.findByBusinessId(
            businessId,
            page,
            limit,
            status,
            consumption_type,
            sort,
            start_date,
            end_date,
        );
    }

    @Get(':id')
    @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id')
    @Roles(RolName.OWNER, RolName.ADMIN)
    update(
        @BusinessIdHeader() businessId: string,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateOrderDto: UpdateOrderDto,
    ) {
        return this.ordersService.update(id, updateOrderDto, businessId);
    }

    @Delete(':id')
    @Roles(RolName.OWNER, RolName.ADMIN)
    remove(@Param('id', new ParseUUIDPipe()) id: string, @BusinessIdHeader() businessId: string) {
        return this.ordersService.remove(id, businessId);
    }

    @Delete('item/:itemId')
    @Roles(RolName.OWNER, RolName.ADMIN)
    deleteItem(@Param('itemId', new ParseUUIDPipe()) itemId: string) {
        return this.ordersService.removeOrderItem(itemId);
    }

    @Delete('item-group/:itemGroupId')
    @Roles(RolName.OWNER, RolName.ADMIN)
    deleteItemGroup(@Param('itemGroupId', new ParseUUIDPipe()) itemGroupId: string) {
        return this.ordersService.removeOrderItemGroup(itemGroupId);
    }
}
