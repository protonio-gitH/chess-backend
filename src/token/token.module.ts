import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { DataBaseModule } from 'src/database/database.module';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [
    DataBaseModule,
    JwtModule,
    // .register({
    //   secret: process.env.PRIVATE_KEY || 'SECRET',
    //   //   signOptions: {
    //   //     expiresIn: '24h',
    //   //   },
    // }),
  ],
  exports: [TokenService],
})
export class TokenModule {}
