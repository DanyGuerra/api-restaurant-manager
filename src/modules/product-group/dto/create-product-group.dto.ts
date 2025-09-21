import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProductGroupDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
