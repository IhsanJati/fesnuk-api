import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FollowService } from './follow.service';
import { CurrentUser } from 'src/common/current-user.decorator';
import { UserResponse } from 'src/model/user.model';
import type { JwtPayload } from 'src/model/auth.model';

@Controller('/api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @UseGuards(AuthGuard)
  followUserAccount(
    @CurrentUser() user: JwtPayload,
    @Body('followUserId', ParseIntPipe) followUserId: number,
  ): Promise<UserResponse> {
    return this.followService.followUserAccount(user.sub, followUserId);
  }
}
