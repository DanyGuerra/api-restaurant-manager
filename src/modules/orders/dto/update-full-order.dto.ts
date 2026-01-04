import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemGroupDto } from './create-full-order.dto';
import { UpdateOrderDto } from './update-order.dto';

export class UpdateFullOrderDto extends UpdateOrderDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemGroupDto)
    group_items?: OrderItemGroupDto[];
}
