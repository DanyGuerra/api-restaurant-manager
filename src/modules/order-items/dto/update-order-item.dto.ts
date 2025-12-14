import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDto {
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  item_total?: number;

  @IsBoolean()
  @IsOptional()
  is_ready?: boolean;
}
