import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role-dto';
import { DataBaseService } from 'src/database/database.service';
import { Role, Prisma } from '@prisma/client';
import { RoleRepository } from 'src/types/prisma';

@Injectable()
export class RolesService {
  private readonly roleRepository: RoleRepository;

  constructor(private readonly db: DataBaseService) {
    this.roleRepository = this.db.role;
  }
  public async createRole(dto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({ data: dto });
    return role;
  }
  public async getRoleByValue(value: string): Promise<Role | null> {
    const role = await this.roleRepository.findUnique({ where: { value } });
    return role;
  }
}
