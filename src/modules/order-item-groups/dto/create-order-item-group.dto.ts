import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderItemGroupDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    subtotal?: number;

    @IsUUID()
    @IsNotEmpty()
    order_id?: string;
}
