import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { BaseResponseVo, PaginateResponseVo, UserGuard } from 'src/core';
import { UserInfo } from 'src/common';
import { User } from '../user/user.entity';
import { CommentCreateDto, CommentListDto } from './dto';
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
    console.log('commentListDto', commentListDto);
    return new BaseResponseVo<PaginateResponseVo<CommentFindOneVo>>(
      await this.commentSerivce.findAll(feedId, commentListDto),
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
}
