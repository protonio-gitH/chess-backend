import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { EventsModule } from './events/events.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    DataBaseModule,
    RolesModule,
    AuthModule,
    GameModule,
    EventsModule,
    TokenModule,
  ],
  //   controllers: [AppController],
  //   providers: [AppService],
})
export class AppModule {}
