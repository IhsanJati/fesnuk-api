import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponse } from 'src/model/user.model';

@Injectable()
export class FollowService {
  constructor(private prismaService: PrismaService) {}

  async followUserAccount(
    currentUserId: number,
    followUserId: number,
  ): Promise<UserResponse> {
    if (currentUserId === followUserId) {
      throw new ConflictException("Can't follow own account");
    }

    const otherUserId = await this.prismaService.user.findUnique({
      where: { id: followUserId },
    });

    if (!otherUserId) {
      throw new NotFoundException('User id not found');
    }

    const isFollowUser = await this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followUserId,
          followingId: currentUserId,
        },
      },
    });

    if (isFollowUser) {
      throw new ConflictException('User has been already followed');
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.follow.create({
          data: {
            followerId: followUserId,
            followingId: currentUserId,
          },
        });

        await tx.user.update({
          where: { id: currentUserId },
          data: { followingCount: { increment: 1 } },
        });

        await tx.user.update({
          where: { id: followUserId },
          data: { followerCount: { increment: 1 } },
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Server down');
    }

    return {
      success: true,
      message: 'Follow user successfully',
    };
  }
}
