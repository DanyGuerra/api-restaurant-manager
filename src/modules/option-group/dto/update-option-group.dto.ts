import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOptionGroup {
  @IsString()
  name?: string;

  @IsInt()
  @Min(0)
  min_options?: number;

  @IsInt()
  @Min(0)
  max_options?: number;

  @IsOptional()
  @IsInt()
  display_order?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
