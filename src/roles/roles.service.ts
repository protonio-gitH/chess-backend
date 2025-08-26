import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role-dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RolesService {
  constructor(private readonly db: DatabaseService) {}
  public async createRole(dto: CreateRoleDto) {}
  public async getRoleByValue(value: String) {}
}
