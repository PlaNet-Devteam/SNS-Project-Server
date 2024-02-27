import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentReplyService } from './comment-reply.service';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import {
  CommentReplyCreateDto,
  CommentReplyListDto,
  CommentReplyUpdateDto,
} from './dto';
import { CommentReply } from './comment-reply.entity';
import { CommentReplyFindOneVo } from './vo';

@Controller()
@ApiTags('COMMENT REPLY')
@UseGuards(new UserGuard())
export class CommentReplyController {
  constructor(private readonly commentReplySerivce: CommentReplyService) {}

  // GET ENDPOINTS

  @Get('/comment/:id([0-9]+)/reply')
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Param('id', ParseIntPipe) commentId: number,
    @Query() commentReplyListDto: CommentReplyListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<CommentReplyFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<CommentReplyFindOneVo>>(
      await this.commentReplySerivce.findAll(commentId, commentReplyListDto),
    );
  }

  /**
   * REPLY 상세
   * @param commentId
   * @returns
   */
  @Get('/reply/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOne(
    @Param('id', ParseIntPipe) commentId: number,
  ): Promise<BaseResponseVo<CommentReplyFindOneVo>> {
    return new BaseResponseVo<CommentReplyFindOneVo>(
      await this.commentReplySerivce.findOne(commentId),
    );
  }

  // POST ENDPOINTS

  /**
   * REPLY 생성
   * @param comemntReplyCreateDto
   * @returns CommentReply
   */

  @Post('/comment/:id([0-9]+)/reply')
  @HttpCode(HttpStatus.CREATED)
  public async createCommentReply(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() comemntReplyCreateDto: CommentReplyCreateDto,
  ): Promise<CommentReply> {
    return await this.commentReplySerivce.createComemntReply(
      user.id,
      commentId,
      comemntReplyCreateDto,
    );
  }

  @Patch('/reply/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async updateCommentReply(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() comemntReplyUpdateDto: CommentReplyUpdateDto,
  ): Promise<CommentReplyFindOneVo> {
    return await this.commentReplySerivce.updateComemntReply(
      commentId,
      comemntReplyUpdateDto,
    );
  }

  /**
   * 코멘트 삭제
   * @param comemntReplyCreateDto
   * @returns CommentReply
   */

  @Delete('/comment/:commentId([0-9]+)/reply/:replyId([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async deleteCommentReply(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('replyId', ParseIntPipe) replyId: number,
  ) {
    return await this.commentReplySerivce.deleteComemntReply(
      commentId,
      replyId,
    );
  }
}
