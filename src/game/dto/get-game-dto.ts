import { IsString } from 'class-validator';

export class GetGameDto {
  @IsString()
  readonly id: string;
}
