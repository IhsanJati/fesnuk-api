import {
  Injectable,
  InternalServerErrorException,
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
      try {
        await this.prismaService.$transaction(async (tx) => {
          await tx.likes.delete({
            where: {
              userId_postId: {
                userId: currentUserId,
                postId,
              },
            },
          });

          await tx.post.update({
            where: { id: postId },
            data: {
              likeCount: { decrement: 1 },
            },
          });
        });

        return {
          success: true,
          message: 'Unlike post successfully',
        };
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Server down');
      }
    }

    try {
      const newLike = await this.prismaService.$transaction(async (tx) => {
        const newLike = await tx.likes.create({
          data: {
            userId: currentUserId,
            postId,
          },
        });

        await tx.post.update({
          where: { id: newLike.postId },
          data: {
            likeCount: { increment: 1 },
          },
        });

        return newLike;
      });

      return {
        success: true,
        message: 'Like post successfully',
        data: newLike,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Server down');
    }
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
        message: 'Like status fetched',
        data: {
          isLiked: true,
        },
      };
    }

    return {
      success: true,
      message: 'Like status fetched',
      data: {
        isLiked: false,
      },
    };
  }
}
