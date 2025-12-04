import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsUUID()
    @IsNotEmpty()
    orderItemGroupId: string;

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
