import { Injectable } from '@nestjs/common';
import { DataBaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';
import { UserRepository, UserWithRoles } from 'src/types/prisma';

@Injectable()
export class UsersService {
  private readonly userRepository: UserRepository;
  constructor(
    private readonly db: DataBaseService,
    private roleServive: RolesService,
  ) {
    this.userRepository = this.db.user;
  }

  public async createUser(dto: CreateUserDto): Promise<UserWithRoles> {
    const role = await this.roleServive.getRoleByValue('USER');
    const hashedPassword = await hash(dto.password, 10);
    const userData: CreateUserDto = {
      email: dto.email,
      password: hashedPassword,
    };
    const user = await this.userRepository.create({
      data: {
        ...userData,
        roles: {
          connect: [{ id: role?.id }],
        },
      },
      include: {
        roles: true,
      },
    });

    return user;
  }

  public async getUsers(): Promise<UserWithRoles[]> {
    const users = await this.userRepository.findMany({
      include: { roles: true },
    });
    return users;
  }

  public async getUserByEmail(email: string): Promise<UserWithRoles | null> {
    const user = this.userRepository.findFirst({
      where: { email },
      include: { roles: true },
    });
    return user;
  }
}
