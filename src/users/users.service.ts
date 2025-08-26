import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  public async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(dto.password, 10);
    const userData: CreateUserDto = {
      email: dto.email,
      password: hashedPassword,
    };
    const user = await this.db.user.create({ data: userData });
    return user;
  }

  public async getUsers(): Promise<User[]> {
    const users = await this.db.user.findMany();
    return users;
  }
}
