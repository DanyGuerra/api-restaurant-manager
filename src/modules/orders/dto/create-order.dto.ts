import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConsumptionType, OrderStatus } from 'src/types/order';

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    customer_name?: string;

    @IsNumber()
    @IsOptional()
    amount_paid?: number;

    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsBoolean()
    @IsOptional()
    paid?: boolean;

    @IsDateString()
    @IsOptional()
    delivered_at?: Date;

    @IsDateString()
    @IsOptional()
    scheduled_at?: Date;

    @IsEnum(ConsumptionType)
    @IsOptional()
    consumption_type?: ConsumptionType;

    @IsString()
    @IsOptional()
    notes?: string;
}
