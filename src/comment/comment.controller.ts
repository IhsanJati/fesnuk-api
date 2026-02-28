import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import {
  type CreateCommentDto,
  createCommentSchema,
} from './dto/createComment.schema';
import { UserResponse } from 'src/model/user.model';
import { CurrentUser } from 'src/common/current-user.decorator';

@Controller('/api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  createComment(
    @CurrentUser('sub') currentUserId: number,
    @Body(new ZodValidationPipe(createCommentSchema))
    createCommentDto: CreateCommentDto,
  ): Promise<UserResponse> {
    return this.commentService.createComment(currentUserId, createCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteComment(
    @CurrentUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ): Promise<UserResponse> {
    if (!commentId) {
      throw new BadRequestException('Id param required');
    }

    return this.commentService.deleteCommentById(currentUserId, commentId);
  }
}
