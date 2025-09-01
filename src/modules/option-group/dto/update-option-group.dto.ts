import { IsOptional, IsString } from 'class-validator';

export class UpdateOptionGroup {
  @IsString()
  @IsOptional()
  name?: string;
}
