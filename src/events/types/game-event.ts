import { Game } from '@prisma/client';

export interface GameEvent {
  games: Game[];
}
