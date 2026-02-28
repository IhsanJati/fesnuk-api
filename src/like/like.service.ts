import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponse } from 'src/model/user.model';

@Injectable()
export class LikeService {
  constructor(private prismaService: PrismaService) {}

  async likeFeedUser(
    currentUserId: number,
    postId: number,
  ): Promise<UserResponse> {
    const postData = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!postData) {
      throw new NotFoundException('Post not found');
    }

    const likeCheck = await this.prismaService.likes.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId,
        },
      },
    });

    if (likeCheck) {
      throw new ConflictException('Post has already liked');
    }

    const newLike = await this.prismaService.likes.create({
      data: {
        userId: currentUserId,
        postId,
      },
    });

    await this.prismaService.post.update({
      where: { id: newLike.postId },
      data: {
        likeCount: { increment: 1 },
      },
    });

    return {
      success: true,
      message: 'Like post successfully',
      data: newLike,
    };
  }

  async checkUserLike(
    currentUserId: number,
    postId: number,
  ): Promise<UserResponse> {
    const postData = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!postData) {
      throw new NotFoundException('Post not found');
    }

    const checkLike = await this.prismaService.likes.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId,
        },
      },
    });

    if (checkLike) {
      return {
        success: true,
        message: 'User has already liked the post',
        data: {
          isLike: true,
        },
      };
    }

    return {
      success: true,
      message: 'User dont like the post',
      data: {
        isLike: false,
      },
    };
  }
}
