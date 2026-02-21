import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { registerUserSchema } from './dto/create-user.schema';
import type { CreateUserRequest } from 'src/users/dto/create-user.schema';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async registerUser(@Body() data: CreateUserRequest) {
    return await this.userService.registerUser(data);
  }
}
