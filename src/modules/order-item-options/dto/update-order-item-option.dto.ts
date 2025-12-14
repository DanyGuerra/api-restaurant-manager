import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemOptionDto {
  @IsNumber()
  @IsOptional()
  price?: number;
}
