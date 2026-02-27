import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FollowModule } from './follow/follow.module';
import { FeedModule } from './feed/feed.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
    FollowModule,
    FeedModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
