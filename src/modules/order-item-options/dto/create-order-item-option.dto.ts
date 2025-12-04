import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderItemOptionDto {
    @IsUUID()
    @IsNotEmpty()
    orderItemId: string;

    @IsUUID()
    @IsNotEmpty()
    productOptionId: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
