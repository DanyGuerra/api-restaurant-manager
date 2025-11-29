import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MinLength(4)
    name?: string;
}
