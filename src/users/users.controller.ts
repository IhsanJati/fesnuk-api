import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { registerUserSchema } from './dto/create-user.schema';
import type { CreateUserRequest } from 'src/users/dto/create-user.schema';
import { UserResponse } from 'src/model/user.model';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async registerUser(@Body() data: CreateUserRequest): Promise<UserResponse> {
    return await this.userService.registerUser(data);
  }

  @Get('search')
  async getSearchUser(
    @Query('username') username: string,
  ): Promise<UserResponse> {
    if (!username) {
      throw new BadRequestException('Query params username not found');
    }
    return await this.userService.getSearchUser(username);
  }

  @Get('/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserResponse> {
    return await this.userService.getUserByUsername(username);
  }
}
