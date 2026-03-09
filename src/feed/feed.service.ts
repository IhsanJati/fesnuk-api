import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/common/prisma.service';
import { FeedQueryDto } from './schemas/feed-query.schema';
import { UserResponse } from 'src/model/user.model';

@Injectable()
export class FeedService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createFeed(
    currentUserId: number,
    file: Express.Multer.File,
    caption: string,
  ): Promise<UserResponse> {
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'feeds',
      [
        { aspect_rasio: '4:5', crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    );

    try {
      const newFeed = await this.prismaService.$transaction(async (tx) => {
        const post = await tx.post.create({
          data: {
            userId: currentUserId,
            image: uploadResult.secure_url,
            imageId: uploadResult.public_id,
            caption,
          },
        });

        await tx.user.update({
          where: { id: currentUserId },
          data: {
            postCount: { increment: 1 },
          },
        });

        return post;
      });

      return {
        success: true,
        message: 'Create feed successfully',
        data: newFeed,
      };
    } catch (error) {
      await this.cloudinaryService.deleteImage(uploadResult.public_id);
      console.log(error);
      throw new InternalServerErrorException('Server down');
    }
  }

  async getAllFeed(
    currentUserId: number,
    query: FeedQueryDto,
  ): Promise<UserResponse> {
    const followings = await this.prismaService.follow.findMany({
      where: { followingId: currentUserId },
      select: { followerId: true },
    });
    const followingIds = followings.map((id) => id.followerId);

    // Query Request
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const feedCount = await this.prismaService.post.count({
      where: {
        userId: { in: [...followingIds, currentUserId] },
      },
    });

    const feeds = await this.prismaService.post.findMany({
      where: {
        userId: { in: [...followingIds, currentUserId] },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(feedCount / limit);

    return {
      success: true,
      message: 'Get feeds successfully',
      data: feeds,
      meta: {
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    };
  }

  async getFeedDetailById(id: number): Promise<UserResponse> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullname: true,
                username: true,
                image: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      success: true,
      message: 'Post detail',
      data: post,
    };
  }

  async deletePostById(
    currentUserId: number,
    id: number,
  ): Promise<UserResponse> {
    const post = await this.prismaService.post.findUnique({ where: { id } });

    if (!post || currentUserId !== post.userId) {
      throw new NotFoundException('Post not found');
    }

    await this.cloudinaryService.deleteImage(post.imageId);

    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.post.delete({
          where: { id },
        });

        await tx.user.update({
          where: { id: currentUserId },
          data: {
            postCount: { decrement: 1 },
          },
        });
      });

      return {
        success: true,
        message: 'Delete post successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Server down');
    }
  }
}
