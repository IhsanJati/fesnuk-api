import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from 'src/common/current-user.decorator';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { type FeedQueryDto, feedQuerySchema } from './dto/feedQuery.schema';

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
  getAllFeed(
    @CurrentUser('sub') currentUserId: number,
    @Query(new ZodValidationPipe(feedQuerySchema)) query: FeedQueryDto,
  ) {
    return this.feedService.getAllFeed(currentUserId, query);
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
