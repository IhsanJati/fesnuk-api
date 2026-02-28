import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FollowModule } from './follow/follow.module';
import { FeedModule } from './feed/feed.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
    FollowModule,
    FeedModule,
    CommentModule,
    LikeModule,
    BookmarkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
