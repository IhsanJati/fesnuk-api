import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponse } from 'src/model/user.model';
import { FollowUserDto } from './schemas/follow.schema';

@Injectable()
export class FollowService {
  constructor(private prismaService: PrismaService) {}

  async followUserAccount(
    currentUserId: number,
    followUserDto: FollowUserDto,
  ): Promise<UserResponse> {
    const followUserId = followUserDto.followUserId;

    if (currentUserId === followUserId) {
      throw new ConflictException("Can't follow own account");
    }

    const otherUserId = await this.prismaService.user.findUnique({
      where: { id: followUserId },
    });

    if (!otherUserId) {
      throw new NotFoundException('User not found');
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
      const newFollow = await this.prismaService.$transaction(async (tx) => {
        const newFollow = await tx.follow.create({
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

        return newFollow;
      });

      return {
        success: true,
        message: 'Follow user successfully',
        data: newFollow,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Server down');
    }
  }

  async unfollowUserAccount(
    currentUserId: number,
    unfollowUserId: number,
  ): Promise<UserResponse> {
    const userToUnfollow = await this.prismaService.user.findUnique({
      where: { id: unfollowUserId },
    });

    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    const isFollowUser = await this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: unfollowUserId,
          followingId: currentUserId,
        },
      },
    });

    if (!isFollowUser) {
      throw new ConflictException('User hasnt followed yet');
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
        success: true,
        message: 'User unfollow successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Server down');
    }
  }

  async getLimitUser(currentUserId: number): Promise<UserResponse> {
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
      message: '5 User who have not followed',
      data: users,
    };
  }

  async isFollowUser(
    currentUserId: number,
    otherUserId: number,
  ): Promise<UserResponse> {
    const isUserExist = await this.prismaService.user.findUnique({
      where: { id: otherUserId },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    const isFollow = await this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: otherUserId,
          followingId: currentUserId,
        },
      },
    });

    if (isFollow) {
      return {
        success: true,
        message: 'User has already followed',
        data: {
          isFollow: true,
        },
      };
    }

    return {
      success: true,
      message: 'User has not follow',
      data: {
        isFollow: false,
      },
    };
  }
}
