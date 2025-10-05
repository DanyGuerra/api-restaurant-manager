import { IsUUID } from 'class-validator';

export class CreateProductOptionGroupDto {
  @IsUUID()
  product_id: string;

  @IsUUID()
  option_group_id: string;
}
