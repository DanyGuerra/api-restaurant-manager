import { IsNotEmpty, IsNumber, IsEmail } from 'class-validator';
import { RolId } from 'src/types/roles';

export class AssignRoleByEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    role_id: RolId.ADMIN | RolId.WAITER;
}
