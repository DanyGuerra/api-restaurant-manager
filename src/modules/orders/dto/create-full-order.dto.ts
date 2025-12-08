import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { CreateOrderDto } from './create-order.dto';

export class GroupDetailsDto extends CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
}

export class CreateFullOrderDto {
    @IsOptional()
    @IsString()
    group_name?: string;

    @ValidateNested()
    @Type(() => GroupDetailsDto)
    group_items: GroupDetailsDto;
}
