import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseService],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
