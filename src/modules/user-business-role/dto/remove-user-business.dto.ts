import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  business_id: string;
}
