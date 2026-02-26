import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from 'src/common/current-user.decorator';

@Controller('/api/feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  createFeed(
    @CurrentUser('sub') currentUserId: number,
    @UploadedFile() image: Express.Multer.File,
    @Body('caption') caption: string,
  ) {
    if (!caption) {
      throw new BadRequestException('Caption must be filled in');
    }
    if (!image) {
      throw new BadRequestException('Image must be filled in');
    }
    return this.feedService.createFeed(currentUserId, image, caption);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllFeed() {
    return this.feedService.getAllFeed();
  }
}
