import { IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsUUID()
  readonly creatorId: string;
}
