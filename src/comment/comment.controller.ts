import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
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
  @UsePipes(new ZodValidationPipe(createCommentSchema))
  createComment(
    @CurrentUser('sub') currentUserId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<UserResponse> {
    return this.commentService.createComment(currentUserId, createCommentDto);
  }
}
