import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/common/prisma.service';

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
  ) {
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
        data: { newFeed },
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      await this.cloudinaryService.deleteImage(uploadResult.public_id);
      throw new InternalServerErrorException('Server down');
    }
  }

  async getAllFeed() {
    const feeds = await this.prismaService.post.findMany({
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
    });
    return feeds;
  }
}
