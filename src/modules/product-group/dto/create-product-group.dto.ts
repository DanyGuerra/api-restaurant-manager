import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductGroupDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
