import { IsUUID, IsString, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsUUID()
  group_product_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  base_price: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
