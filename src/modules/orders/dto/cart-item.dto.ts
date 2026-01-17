import { IsArray, IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CartItemDto {
  @IsUUID('4')
  product_id: string;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  is_ready?: boolean;

  @IsArray()
  @IsUUID('4', { each: true })
  selected_options_ids: string[];
}
