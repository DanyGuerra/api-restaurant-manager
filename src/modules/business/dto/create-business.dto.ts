import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address: string;
}
