import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Define controller methods here
}
