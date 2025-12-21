import { IsNotEmpty, IsNumber } from 'class-validator';
import { RolId } from 'src/types/roles';

export class AssignRoleDto {
  @IsNumber()
  @IsNotEmpty()
  role_id: RolId.ADMIN | RolId.WAITER;
}
