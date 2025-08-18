import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user-dto';
// import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  public async createUser(dto: CreateUserDto) {}

  //   public async getUsers(): Promise<User[]> {
  // 	this.db.
  //   }
}
