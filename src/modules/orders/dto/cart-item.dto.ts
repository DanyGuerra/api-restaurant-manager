import { IsArray, IsNumber, IsUUID } from 'class-validator';

export class CartItemDto {
  @IsUUID('4')
  product_id: string;

  @IsNumber()
  quantity: number;

  @IsArray()
  @IsUUID('4', { each: true })
  selected_options_ids: string[];
}
