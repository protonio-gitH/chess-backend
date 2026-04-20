import { IsString } from 'class-validator';

export class GetProfileDto {
  @IsString()
  readonly userId: string;
}
