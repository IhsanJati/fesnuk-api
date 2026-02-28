import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { UserResponse } from 'src/model/user.model';

@Controller('/api/bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  toggleSavedFeed(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<UserResponse> {
    return this.bookmarkService.toggleSavedFeed(currentUserId, postId);
  }
}
