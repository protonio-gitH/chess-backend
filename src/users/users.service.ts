import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataBaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';
import type { UserRepository, UserWithRoles } from './types';
import { AddRoleDto } from './dto/add-role-dto';
import { BanDto } from './dto/ban-dto';

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

  public async getUserById(id: string): Promise<UserWithRoles | null> {
    const user = this.userRepository.findFirst({
      where: { id },
      include: { roles: true },
    });
    return user;
  }

  public async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.userRepository.findUnique({
      where: { id: dto.userId },
      include: { roles: true },
    });
    const role = await this.roleServive.getRoleByValue(dto.value);
    if (role && user) {
      await this.userRepository.update({
        where: { id: user.id },
        data: {
          roles: {
            connect: { id: role.id },
          },
        },
      });
      return dto;
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  public async ban(dto: BanDto): Promise<BanDto> {
    const user = await this.userRepository.findUnique({
      where: { id: dto.userId },
      include: { roles: true },
    });
    if (user) {
      await this.userRepository.update({
        where: { id: user.id },
        data: {
          banned: true,
          banReason: dto.banReason,
        },
      });
      return dto;
    }
    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
