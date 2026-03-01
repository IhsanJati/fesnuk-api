import {
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
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { UserResponse } from 'src/model/user.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { type EditUserDto, editUserSchema } from './schemas/update-user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  type SearchUserQueryDto,
  searchUserQuerySchema,
} from './schemas/user-query.schema';
import {
  type UsernameParamDto,
  usernameParamSchema,
} from './schemas/user-param.schema';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/search')
  @UseGuards(AuthGuard)
  async getSearchUser(
    @Query(new ZodValidationPipe(searchUserQuerySchema))
    searchUserQueryDto: SearchUserQueryDto,
  ): Promise<UserResponse> {
    return await this.userService.getSearchUser(searchUserQueryDto);
  }

  @Put('/edit-user')
  @UseGuards(AuthGuard)
  async editUser(
    @CurrentUser('sub') currentUserId: number,
    @Body(new ZodValidationPipe(editUserSchema)) editUserDto: EditUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserById(currentUserId, editUserDto);
  }

  @Patch('/edit-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async updateAvatar(
    @CurrentUser('sub') currentUserId: number,
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
    return this.userService.uploadAvatar(currentUserId, file);
  }

  @Get('/:username')
  @UseGuards(AuthGuard)
  async getUserByUsername(
    @Param(new ZodValidationPipe(usernameParamSchema))
    usernameParamDto: UsernameParamDto,
  ): Promise<UserResponse> {
    return await this.userService.getUserByUsername(usernameParamDto);
  }
}
