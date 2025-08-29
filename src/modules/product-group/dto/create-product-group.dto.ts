import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProductGroupDto {
  @IsUUID()
  business_id: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
