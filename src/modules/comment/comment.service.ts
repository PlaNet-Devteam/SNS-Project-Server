import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';
import { CommentCreateDto, CommentListDto } from './dto';
import { FeedRepository } from '../feed/feed.repository';
import { PaginateResponseVo } from 'src/core';
import { CommentFindOneVo } from './vo';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly feedRepository: FeedRepository,
  ) {}

  // GET SERVICES

  /**
   *
   * @param commentListDto
   * @returns
   */
  public async findAll(
    commentListDto?: CommentListDto,
  ): Promise<PaginateResponseVo<CommentFindOneVo>> {
    const comments = await this.commentRepository.findAll(commentListDto);
    if (!comments) throw new NotFoundException();
    return comments;
  }

  // INSERT SERVICES

  /**
   * 코멘트 생성
   * @param userId
   * @param feedId
   * @param comemntCreateDto
   * @returns
   */
  async createComemnt(
    userId: number,
    feedId: number,
    comemntCreateDto: CommentCreateDto,
  ): Promise<Comment> {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException();

    return await this.commentRepository.createComemnt(
      userId,
      feedId,
      comemntCreateDto,
    );
  }
}
