import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  deletePostById(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.feedService.deletePostById(currentUserId, id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getFeedDetails(@Param('id', ParseIntPipe) id: number) {
    return this.feedService.getFeedDetailById(id);
  }
}
