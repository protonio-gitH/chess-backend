import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    TokenModule,
    forwardRef(() => UsersModule),
    JwtModule,
    // JwtModule.register({
    //   secret: process.env.PRIVATE_KEY || 'SECRET',
    //   signOptions: {
    //     expiresIn: '24h',
    //   },
    // }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
