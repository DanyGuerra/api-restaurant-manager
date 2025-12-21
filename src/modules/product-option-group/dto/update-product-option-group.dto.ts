import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProductOptionGroupDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsUUID()
    @IsNotEmpty()
    current_option_group_id: string;

    @IsUUID()
    @IsNotEmpty()
    new_option_group_id: string;
}
