import { IsUUID } from 'class-validator';

export class GetGameDto {
  @IsUUID()
  readonly id: string;
}
