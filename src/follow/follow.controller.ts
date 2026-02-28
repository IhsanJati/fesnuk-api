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

@Controller('/api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @UseGuards(AuthGuard)
  followUserAccount(
    @CurrentUser('sub') currentUserId: number,
    @Body('followUserId', ParseIntPipe) followUserId: number,
  ): Promise<UserResponse> {
    return this.followService.followUserAccount(currentUserId, followUserId);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  getLimitUser(@CurrentUser('sub') currentUserId: number) {
    return this.followService.getLimitUser(currentUserId);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  isFollowUser(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) otherUserId: number,
  ) {
    return this.followService.isFollowUser(currentUserId, otherUserId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  unfollowUserAccount(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) unfollowUserId: number,
  ) {
    return this.followService.unfollowUserAccount(
      currentUserId,
      unfollowUserId,
    );
  }
}
