import { IsString } from 'class-validator';

export class AddRoleDto {
  @IsString()
  readonly userId: string;
  @IsString()
  readonly value: string;
}
