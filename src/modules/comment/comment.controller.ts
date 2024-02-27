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
import { CommentService } from './comment.service';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import { CommentCreateDto, CommentListDto, CommentUpdateDto } from './dto';
import { Comment } from './comment.entity';
import { CommentFindOneVo } from './vo';

@Controller()
@ApiTags('COMMENT')
@UseGuards(new UserGuard())
export class CommentController {
  constructor(private readonly commentSerivce: CommentService) {}

  // GET ENDPOINTS

  @Get('/feed/:id([0-9]+)/comment')
  @HttpCode(HttpStatus.OK)
  public async findAll(
    @Param('id', ParseIntPipe) feedId: number,
    @Query() commentListDto: CommentListDto,
  ): Promise<BaseResponseVo<PaginateResponseVo<CommentFindOneVo>>> {
    return new BaseResponseVo<PaginateResponseVo<CommentFindOneVo>>(
      await this.commentSerivce.findAll(feedId, commentListDto),
    );
  }

  /**
   * 코멘트 상세
   * @param commentId
   * @returns
   */
  @Get('/comment/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async findOne(
    @Param('id', ParseIntPipe) commentId: number,
  ): Promise<BaseResponseVo<CommentFindOneVo>> {
    return new BaseResponseVo<CommentFindOneVo>(
      await this.commentSerivce.findOne(commentId),
    );
  }

  // POST ENDPOINTS

  /**
   * 코멘트 생성
   * @param comemntCreateDto
   * @returns Comment
   */

  @Post('/feed/:id([0-9]+)/comment')
  @HttpCode(HttpStatus.CREATED)
  public async createComment(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) feedId: number,
    @Body() comemntCreateDto: CommentCreateDto,
  ): Promise<Comment> {
    return await this.commentSerivce.createComemnt(
      user.id,
      feedId,
      comemntCreateDto,
    );
  }

  @Patch('/comment/:id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async updateComment(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() comemntUpdateDto: CommentUpdateDto,
  ): Promise<CommentFindOneVo> {
    return await this.commentSerivce.updateComemnt(commentId, comemntUpdateDto);
  }

  /**
   * 코멘트 삭제
   * @param comemntCreateDto
   * @returns Comment
   */

  @Delete('/feed/:feedId([0-9]+)/comment/:commentId([0-9]+)')
  @HttpCode(HttpStatus.OK)
  public async deleteComment(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentSerivce.deleteComemnt(feedId, commentId);
  }
}
