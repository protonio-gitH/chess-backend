import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role-dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesSerivce: RolesService) {}

  @Post()
  public create(@Body() dto: CreateRoleDto) {
    return this.rolesSerivce.createRole(dto);
  }

  @Get('/:value')
  public getByValue(@Param('value') value: string) {
    return this.rolesSerivce.getRoleByValue(value);
  }
}
