import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { UserResponse } from 'src/model/user.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import type { JwtPayload } from 'src/model/auth.model';
import { type EditUserDto, editUserSchema } from './dto/update-user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/search')
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
  async editUser(
    @Body(new ZodValidationPipe(editUserSchema)) editUserDto: EditUserDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<UserResponse> {
    return await this.userService.updateUserById(user.sub, editUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/edit-avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async updateAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UserResponse> {
    return this.userService.uploadAvatar(user.sub, file);
  }

  @Get('/:username')
  @UseGuards(AuthGuard)
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserResponse> {
    return await this.userService.getUserByUsername(username);
  }
}
