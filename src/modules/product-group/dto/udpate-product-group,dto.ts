import { IsOptional, IsString } from 'class-validator';

export class UpdateProductGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
