import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getByPk(@Param('id') id: number) {
    return this.userService.getByPk(id);
  }
}
