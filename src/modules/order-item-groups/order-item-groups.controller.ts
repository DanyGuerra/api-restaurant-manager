import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';
import { OrderItemGroupsService } from './order-item-groups.service';
import { CreateOrderItemGroupDto } from './dto/create-order-item-group.dto';
import { UpdateOrderItemGroupDto } from './dto/update-order-item-group.dto';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';

@Controller('order-item-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderItemGroupsController {
  constructor(private readonly orderItemGroupsService: OrderItemGroupsService) { }

  @Post()
  @Roles(RolName.OWNER)
  create(@Body() createOrderItemGroupDto: CreateOrderItemGroupDto) {
    return this.orderItemGroupsService.create(createOrderItemGroupDto);
  }

  @Get('business')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findAllByBusinessId(@BusinessIdHeader() businessId: string) {
    return this.orderItemGroupsService.findAllByBusinessId(businessId);
  }

  @Get('order/:orderId')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findAllByOrderId(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return this.orderItemGroupsService.findAllByOrderId(orderId);
  }

  @Get(':id')
  @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemGroupsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolName.OWNER, RolName.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderItemGroupDto: UpdateOrderItemGroupDto,
  ) {
    return this.orderItemGroupsService.update(id, updateOrderItemGroupDto);
  }

  @Delete(':id')
  @Roles(RolName.OWNER)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemGroupsService.remove(id);
  }
}
