import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { CreateOrderDto } from './create-order.dto';

export class OrderItemGroupDto {
  @IsOptional()
  @IsString()
  group_name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class CreateFullOrderDto extends CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemGroupDto)
  group_items: OrderItemGroupDto[];
}
