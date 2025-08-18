import { IsString } from 'class-validator';

export class UpdateRolDto {
  @IsString()
  name?: string;
}
