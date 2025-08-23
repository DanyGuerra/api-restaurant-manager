import { IsOptional, IsString } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address: string;
}
