import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AddTokenDto } from './dto/add-token.dto';
import type { UserWithRoles } from 'src/users/types';
import type { TokenRepository } from 'src/token/types';
import { GenerateTokenResponse, JwtPayload } from 'src/auth/types';
import { JwtService } from '@nestjs/jwt';
import { DataBaseService } from 'src/database/database.service';
import { DeleteTokenDto } from './dto/delete-token-dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Prisma, Token } from '@prisma/client';

@Injectable()
export class TokenService {
  private readonly tokenRepository: TokenRepository;
  constructor(
    private readonly db: DataBaseService,
    private jwtService: JwtService,
  ) {
    this.tokenRepository = this.db.token;
  }

  public async addRefreshToken(addTokenDto: AddTokenDto): Promise<void> {
    await this.tokenRepository.create({ data: addTokenDto });
  }

  public async logout(deleteTokenDto: DeleteTokenDto): Promise<void> {
    await this.tokenRepository.delete({ where: deleteTokenDto });
  }

  //   public async refresh(refreshTokenDto: RefreshTokenDto) {
  //     const userData = await this.validateRefreshToken(
  //       refreshTokenDto.refreshToken,
  //     );
  //     const tokenFromDb = await this.fintToken(refreshTokenDto.refreshToken);
  //     if (!userData || !tokenFromDb) {
  //       throw new UnauthorizedException({
  //         message: 'Пользователь не авторизован',
  //       });
  //     }
  //   }

  public validateAccessToken(token: string): JwtPayload | null {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }
  public validateRefreshToken(token: string): JwtPayload | null {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.REFRESH_KEY,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  public fintToken(token: string): Promise<Token | null> {
    const tokenData = this.tokenRepository.findFirst({
      where: { refreshToken: token },
    });
    return tokenData;
  }

  public generateTokens(user: UserWithRoles): GenerateTokenResponse {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.PRIVATE_KEY,
        expiresIn: '1m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_KEY,
        expiresIn: '30d',
      }),
    };
  }
}
