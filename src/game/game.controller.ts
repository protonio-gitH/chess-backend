import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game-dto';
import { Game, Prisma } from '@prisma/client';
import { AcceptGameDto } from './dto/accept-game-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetGameDto } from './dto/get-game-dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/:id')
  public async getGame(@Param() dto: GetGameDto): Promise<Game | null> {
    return this.gameService.getGame(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() dto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/accept')
  public async accept(@Body() dto: AcceptGameDto): Promise<Game> {
    return this.gameService.acceptGame(dto);
  }
}
