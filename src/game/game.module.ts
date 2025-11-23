import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DataBaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [DataBaseModule, JwtModule, EventsModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
