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

  async unfollowUserAccount(currentUserId: number, unfollowUserId: number) {
    const userToUnfollow = await this.prismaService.user.findUnique({
      where: { id: unfollowUserId },
    });

    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.follow.delete({
          where: {
            followerId_followingId: {
              followerId: unfollowUserId,
              followingId: currentUserId,
            },
          },
        });

        await tx.user.update({
          where: { id: currentUserId },
          data: { followingCount: { decrement: 1 } },
        });

        await tx.user.update({
          where: { id: unfollowUserId },
          data: { followerCount: { decrement: 1 } },
        });
      });

      return {
        message: 'User unfollow successfully',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Server down');
    }
  }

  async getLimitUser(currentUserId: number) {
    const followedByUser = await this.prismaService.follow.findMany({
      where: { followingId: currentUserId },
      select: { followerId: true },
    });

    const followedId = followedByUser.map((id) => id.followerId);

    const users = await this.prismaService.user.findMany({
      where: { id: { notIn: [...followedId, currentUserId] } },
      select: { id: true, fullname: true, username: true, image: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: '5 User who have been followed',
      data: users,
    };
  }
}
