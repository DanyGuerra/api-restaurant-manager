import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsUUID()
    @IsNotEmpty()
    order_item_group_id: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsOptional()
    item_total?: number;


    @IsBoolean()
    @IsOptional()
    is_ready?: boolean;
}
