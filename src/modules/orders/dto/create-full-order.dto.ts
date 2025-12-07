import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';
import { CartItemDto } from './cart-item.dto';

export class CreateFullOrderDto extends CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
}
