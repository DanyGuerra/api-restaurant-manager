import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_-]+$/, {
    message: 'Username can only contain lowercase letters, numbers, and the symbols _ or -',
  })
  username: string;

  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  verification_token?: string;
}
