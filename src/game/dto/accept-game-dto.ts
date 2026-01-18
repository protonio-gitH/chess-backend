import { IsUUID } from 'class-validator';

export class AcceptGameDto {
  @IsUUID()
  readonly gameId: string;
  @IsUUID()
  readonly userId: string;
}
