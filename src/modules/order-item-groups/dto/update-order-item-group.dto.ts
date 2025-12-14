import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderItemGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  subtotal?: number;
}
