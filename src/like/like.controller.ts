import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserResponse } from 'src/model/user.model';
import { CurrentUser } from 'src/common/current-user.decorator';

@Controller('/api/like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  likeFeedUser(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<UserResponse> {
    return this.likeService.likeFeedUser(currentUserId, postId);
  }
}
