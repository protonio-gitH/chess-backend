import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role-dto';
import { Role, Prisma } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private rolesSerivce: RolesService) {}

  @Post()
  public create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.rolesSerivce.createRole(dto);
  }

  @Get('/:value')
  public getByValue(@Param('value') value: string): Promise<Role | null> {
    return this.rolesSerivce.getRoleByValue(value);
  }
}
