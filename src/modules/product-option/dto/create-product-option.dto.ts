import {
  IsUUID,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductOptionDto {
  @IsUUID()
  option_group_id: string;

  @IsString()
  name: string; // Example: Large, Medium, Small

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

export class UpdateProductOptionDto {
  @IsOptional()
  @IsUUID()
  option_group_id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
