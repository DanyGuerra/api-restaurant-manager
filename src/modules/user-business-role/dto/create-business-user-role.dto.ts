import { IsUUID, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRoleDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  business_id: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;
}
