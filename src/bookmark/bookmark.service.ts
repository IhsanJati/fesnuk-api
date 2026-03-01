import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponse } from 'src/model/user.model';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async toggleSavedFeed(
    currentUserId: number,
    postId: number,
  ): Promise<UserResponse> {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isFeedSaved = await this.prismaService.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId,
        },
      },
    });

    if (isFeedSaved) {
      await this.prismaService.bookmark.delete({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId,
          },
        },
      });

      return {
        success: true,
        message: 'Unsave feed successfully',
      };
    }

    const newBookmark = await this.prismaService.bookmark.create({
      data: {
        userId: currentUserId,
        postId,
      },
    });

    return {
      success: true,
      message: 'Save feed successfully',
      data: newBookmark,
    };
  }

  async isFeedSaved(
    currentUserId: number,
    postId: number,
  ): Promise<UserResponse> {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isFeedSaved = await this.prismaService.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId,
        },
      },
    });

    if (isFeedSaved) {
      return {
        success: true,
        message: 'Bookmark status fetched',
        data: {
          isSaved: true,
        },
      };
    }

    return {
      success: true,
      message: 'Bookmark status fetched',
      data: {
        isSaved: false,
      },
    };
  }
}
