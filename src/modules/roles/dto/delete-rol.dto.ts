import { IsString } from 'class-validator';

export class DeleteRolDto {
  @IsString()
  id: string;
}
