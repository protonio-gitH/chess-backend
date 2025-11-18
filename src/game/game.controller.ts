import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game-dto';
import { Game, Prisma } from '@prisma/client';
import { AcceptGameDto } from './dto/accept-game-dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  public async create(@Body() dto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(dto);
  }

  @Post('/accept')
  public async accept(@Body() dto: AcceptGameDto) {
    return this.gameService.acceptGame(dto);
  }
}
