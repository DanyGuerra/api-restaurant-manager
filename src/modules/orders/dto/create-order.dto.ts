import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsDateString()
  @IsOptional()
  delivered_at?: Date;

  @IsDateString()
  @IsOptional()
  scheduled_at?: Date;

  @IsEnum(ConsumptionType)
  @IsOptional()
  consumption_type?: ConsumptionType;

  @IsNumber()
  @IsOptional()
  table_number?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
