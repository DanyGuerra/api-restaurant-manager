import { IsEnum } from 'class-validator';
import { RolName } from 'src/types/roles';

export class CreateRolDto {
  @IsEnum(RolName, { message: 'Role must be ADMIN, OWNER or WAITER' })
  name: RolName;
}
