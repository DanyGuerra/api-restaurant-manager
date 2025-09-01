import { IsString } from 'class-validator';

export class CreateOptionGroup {
  @IsString()
  name: string;
}
