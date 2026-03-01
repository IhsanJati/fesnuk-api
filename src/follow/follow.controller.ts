import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FollowService } from './follow.service';
import { CurrentUser } from 'src/common/current-user.decorator';
import { UserResponse } from 'src/model/user.model';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { type FollowUserDto, followUserSchema } from './schemas/follow.schema';

@Controller('/api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @UseGuards(AuthGuard)
  followUserAccount(
    @CurrentUser('sub') currentUserId: number,
    @Body(new ZodValidationPipe(followUserSchema)) followUserDto: FollowUserDto,
  ): Promise<UserResponse> {
    return this.followService.followUserAccount(currentUserId, followUserDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  getLimitUser(
    @CurrentUser('sub') currentUserId: number,
  ): Promise<UserResponse> {
    return this.followService.getLimitUser(currentUserId);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  isFollowUser(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) otherUserId: number,
  ): Promise<UserResponse> {
    return this.followService.isFollowUser(currentUserId, otherUserId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  unfollowUserAccount(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) unfollowUserId: number,
  ): Promise<UserResponse> {
    return this.followService.unfollowUserAccount(
      currentUserId,
      unfollowUserId,
    );
  }
}
