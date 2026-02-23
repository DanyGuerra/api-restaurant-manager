import { IsNumber, IsOptional, IsString, Min, IsUUID } from 'class-validator';

export class AddMoneyDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsOptional()
    order_id?: string;
}
