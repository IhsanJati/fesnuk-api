import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { type CreateCommentDto } from './dto/createComment.schema';
import { UserResponse } from 'src/model/user.model';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<UserResponse> {
    const postData = await this.prismaService.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!postData) {
      throw new NotFoundException('Post not found');
    }

    try {
      const comment = await this.prismaService.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            userId: currentUserId,
            postId: createCommentDto.postId,
            content: createCommentDto.content,
          },
        });

        await tx.post.update({
          where: {
            id: createCommentDto.postId,
          },
          data: {
            commentCount: { increment: 1 },
          },
        });

        return comment;
      });

      return {
        success: true,
        message: 'Create comment successfully',
        data: comment,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Server down');
    }
  }
}
