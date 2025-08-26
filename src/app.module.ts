import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    DatabaseModule,
    RolesModule,
  ],
  //   controllers: [AppController],
  //   providers: [AppService],
})
export class AppModule {}
