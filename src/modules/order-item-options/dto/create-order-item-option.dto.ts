import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderItemOptionDto {
  @IsUUID()
  @IsNotEmpty()
  order_item_id: string;

  @IsUUID()
  @IsNotEmpty()
  product_option_id: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
