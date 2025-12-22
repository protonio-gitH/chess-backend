import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import type { GenerateTokenResponse } from './types';
import type { Response, Request } from 'express';
import { TokenService } from 'src/token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('/login')
  public async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(userDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // ставить true в проде
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('/registration')
  public async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.registration(userDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // ставить true в проде
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Get('/logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken } = req.cookies;
    res.clearCookie('refreshToken');
    res.status(204);
    if (refreshToken) await this.tokenService.logout({ refreshToken });
  }

  @Get('/refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = req.cookies;
    const tokens = await this.authService.refresh({ refreshToken });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // ставить true в проде
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }
}
