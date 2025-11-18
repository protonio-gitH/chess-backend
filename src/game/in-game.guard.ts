import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class InGameGuard implements CanActivate {
  constructor(private db: DataBaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = Number(req.body.userId);

    if (!userId) {
      throw new ConflictException('User ID is missing.');
    }

    const inProgressGame = await this.db.game.findFirst({
      where: {
        players: {
          some: {
            userId: userId,
          },
        },
        status: 'in_progress',
      },
    });

    if (inProgressGame) {
      throw new ConflictException('User is already in an in-progress game.');
    }

    return true;
  }
}
