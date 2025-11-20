import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { GameRepository } from 'src/types/prisma';
import { CreateGameDto } from './dto/create-game-dto';
import { Game, Prisma } from '@prisma/client';
import { AcceptGameDto } from './dto/accept-game-dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class GameService {
  private readonly gameRepository: GameRepository;

  constructor(private readonly db: DataBaseService) {
    this.gameRepository = this.db.game;
  }

  public async createGame(dto: CreateGameDto): Promise<Game> {
    const user = await this.db.user.findFirstOrThrow({
      where: { id: dto.creatorId },
    });

    const inProgressGame = await this.gameRepository.findFirst({
      where: { players: { some: { id: user.id } }, status: 'in_progress' },
    });

    if (inProgressGame) {
      throw new ConflictException('User is already in an in-progress game.');
    }

    const waitingGame = await this.gameRepository.findFirst({
      where: { creatorId: user.id, status: 'waiting' },
    });
    if (waitingGame) {
      await this.gameRepository.delete({ where: { id: waitingGame.id } });
    }

    const game = await this.db.$transaction(async (tx) => {
      const newGame = await tx.game.create({
        data: {
          creatorId: user.id,
          status: 'waiting',
          whitePlayerId: user.id,
          players: {
            connect: { id: user.id },
          },
        },
      });

      return newGame;
    });
    return game;
  }

  public async acceptGame(dto: AcceptGameDto) {
    const inProgressGame = await this.gameRepository.findFirst({
      where: {
        players: {
          some: {
            id: dto.userId,
          },
        },
        status: {
          in: ['in_progress', 'waiting'],
        },
      },
    });
    if (inProgressGame) {
      throw new ConflictException('User is already in a game.');
    }
    const updateGame = await this.db.$transaction(async (tx) => {
      const game = await tx.game.update({
        where: { id: dto.gameId, status: 'waiting' },
        data: {
          status: 'in_progress',
          blackPlayerId: dto.userId,
          players: {
            connect: { id: dto.userId },
          },
        },
      });

      return game;
    });

    return updateGame;
  }
}
