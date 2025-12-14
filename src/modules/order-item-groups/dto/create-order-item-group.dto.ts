import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateOrderItemGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsNotEmpty()
  order_id?: string;
}
