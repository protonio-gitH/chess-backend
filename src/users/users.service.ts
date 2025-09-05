import { Injectable } from '@nestjs/common';
import { DataBaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

type userRepository = Prisma.UserDelegate;

@Injectable()
export class UsersService {
  private readonly userRepository: userRepository;
  constructor(private readonly db: DataBaseService) {
    this.userRepository = this.db.user;
  }

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
