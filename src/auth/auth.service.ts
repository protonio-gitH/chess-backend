import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserWithRoles } from 'src/users/types';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import type { GenerateTokenResponse } from './types';
import { TokenService } from 'src/token/token.service';
import { RefreshTokenDto } from 'src/token/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UsersService,
    // private jwtService: JwtService,
  ) {}
  public async login(userDto: CreateUserDto): Promise<GenerateTokenResponse> {
    const user = await this.validateUser(userDto);
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);

    this.tokenService.addRefreshToken({ userId: user.id, refreshToken });
    return { accessToken, refreshToken };
  }
  public async registration(
    userDto: CreateUserDto,
  ): Promise<GenerateTokenResponse> {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.createUser(userDto);
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);

    this.tokenService.addRefreshToken({ userId: user.id, refreshToken });
    return { accessToken, refreshToken };
  }

  //   private generateTokens(user: UserWithRoles): GenerateTokenResponse {
  //     const payload = { email: user.email, id: user.id, roles: user.roles };
  //     return {
  //       accessToken: this.jwtService.sign(payload, { expiresIn: '5m' }),
  //       refreshToken: this.jwtService.sign(payload, {
  //         secret: process.env.REFRESH_KEY,
  //         expiresIn: '30d',
  //       }),
  //     };
  //   }

  public async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<GenerateTokenResponse> {
    if (!refreshTokenDto) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
    const userData = await this.tokenService.validateRefreshToken(
      refreshTokenDto.refreshToken,
    );
    const tokenFromDb = await this.tokenService.fintToken(
      refreshTokenDto.refreshToken,
    );

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }

    const user = await this.userService.getUserById(userData.id);

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      user!,
    );
    const deleteOldToken = await this.tokenService.logout(refreshTokenDto);
    await this.tokenService.addRefreshToken({ userId: user!.id, refreshToken });
    return { accessToken, refreshToken };
  }

  private async validateUser(userDto: CreateUserDto): Promise<UserWithRoles> {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await compare(
      userDto.password,
      user?.password ?? '',
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный email или пароль',
    });
  }
}
