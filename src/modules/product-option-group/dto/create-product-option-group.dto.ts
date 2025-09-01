import { IsUUID, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductOptionGroupDto {
  @IsUUID()
  product_id: string;

  @IsUUID()
  option_group_id: string;

  @IsInt()
  @Min(0)
  min_options: number;

  @IsInt()
  @Min(0)
  max_options: number;

  @IsOptional()
  @IsInt()
  display_order?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
