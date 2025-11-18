import { Controller, Body, Post, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from '@prisma/client';
import { UserWithRoles } from 'src/types/prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { AddRoleDto } from './dto/add-role-dto';
import { BanDto } from './dto/ban-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<UserWithRoles> {
    return await this.usersService.createUser(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  public async getUsers(): Promise<UserWithRoles[]> {
    return await this.usersService.getUsers();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  public async addRole(@Body() dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.usersService.addRole(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/ban')
  public async ban(@Body() dto: BanDto) {
    return await this.usersService.ban(dto);
  }
}
