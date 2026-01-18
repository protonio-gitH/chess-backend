import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import type { GameRepository } from './types';
import { CreateGameDto } from './dto/create-game-dto';
import { Game, Prisma } from '@prisma/client';
import { AcceptGameDto } from './dto/accept-game-dto';
import { ConflictException } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { Subject, interval, Subscription, Observable } from 'rxjs';
import { GetGameDto } from './dto/get-game-dto';

@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {
  private readonly gameRepository: GameRepository;
  private sub!: Subscription;

  constructor(
    private readonly db: DataBaseService,
    private readonly eventsService: EventsService,
  ) {
    this.gameRepository = this.db.game;
  }

  onModuleInit() {
    this.sub = interval(3000).subscribe(() => {
      this.updateGamesList();
    });
  }

  onModuleDestroy() {
    this.sub.unsubscribe();
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

  public async acceptGame(dto: AcceptGameDto): Promise<Game> {
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

  public async getGame(dto: GetGameDto): Promise<Game | null> {
    const game = await this.gameRepository.findFirst({
      where: { id: dto.id },
    });
    return game;
  }

  private async updateGamesList(): Promise<void> {
    try {
      const games = await this.gameRepository.findMany({
        where: { status: 'waiting' },
        include: {
          players: {
            select: { id: true, email: true },
          },
          whitePlayer: { select: { id: true, email: true } },
          blackPlayer: { select: { id: true, email: true } },
          creator: { select: { id: true, email: true } },
        },
      });
      await this.eventsService.sendGames({ games });
    } catch (e) {
      console.error(`updateGamesList error ` + e.message);
    }
  }
}
