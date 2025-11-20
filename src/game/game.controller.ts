import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game-dto';
import { Game, Prisma } from '@prisma/client';
import { AcceptGameDto } from './dto/accept-game-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() dto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/accept')
  public async accept(@Body() dto: AcceptGameDto) {
    return this.gameService.acceptGame(dto);
  }
}
