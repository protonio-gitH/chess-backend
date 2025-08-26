import { Controller, Body, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('registration')
  public async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(dto);
  }

  @Get()
  public async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }
}
