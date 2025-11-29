import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConsumptionType, OrderStatus } from 'src/types/order';

export class UpdateOrderDto {
    @IsOptional()
    @IsString()
    customer_name?: string;

    @IsOptional()
    @IsNumber()
    total?: number;

    @IsOptional()
    @IsNumber()
    amount_paid?: number;

    @IsOptional()
    @IsNumber()
    change?: number;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    @IsDateString()
    delivered_at?: Date;

    @IsOptional()
    @IsDateString()
    scheduled_at?: Date;

    @IsOptional()
    @IsEnum(ConsumptionType)
    consumption_type?: ConsumptionType;

    @IsOptional()
    @IsString()
    notes?: string;
}
