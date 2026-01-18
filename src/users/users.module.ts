import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { DataBaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { RolesModule } from "src/roles/roles.module";

@Module({
  imports: [DataBaseModule, RolesModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
