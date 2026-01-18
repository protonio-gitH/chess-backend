import { IsUUID, IsString } from 'class-validator';

export class AddRoleDto {
  @IsUUID()
  readonly userId: string;
  @IsString()
  readonly value: string;
}
