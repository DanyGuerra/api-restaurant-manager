import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConsumptionType, OrderStatus } from 'src/types/order';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsNumber()
  amount_paid?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

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
