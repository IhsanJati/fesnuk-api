import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { UserResponse } from 'src/model/user.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import type { JwtPayload } from 'src/model/auth.model';
import { type EditUserDto, editUserSchema } from './dto/update-user.schema';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('search')
  async getSearchUser(
    @Query('username') username: string,
  ): Promise<UserResponse> {
    if (!username) {
      throw new BadRequestException('Query params username not found');
    }
    return await this.userService.getSearchUser(username);
  }

  @Put('/edit-user')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(editUserSchema))
  async editUser(
    @Body() editUserDto: EditUserDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<UserResponse> {
    return await this.userService.updateUserById(user.sub, editUserDto);
  }

  @Get('/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserResponse> {
    return await this.userService.getUserByUsername(username);
  }
}
