import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';
import { CommentCreateDto, CommentListDto, CommentUpdateDto } from './dto';
import { FeedRepository } from '../feed/feed.repository';
import { PaginateResponseVo } from 'src/core';
import { CommentFindOneVo } from './vo';
import * as errors from '../../locales/kr/errors.json';

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
    feedId: number,
    commentListDto?: CommentListDto,
  ): Promise<PaginateResponseVo<CommentFindOneVo>> {
    const comments = await this.commentRepository.findAll(
      feedId,
      commentListDto,
    );
    if (!comments) throw new NotFoundException(errors.comment.notFound);
    return comments;
  }

  /**
   * 코멘트 상세
   * @param comemntId
   * @returns
   */
  public async findOne(comemntId: number): Promise<CommentFindOneVo> {
    const comment = await this.commentRepository.findOneComment(comemntId);
    if (!comment) throw new NotFoundException(errors.comment.notFound);
    return comment;
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
    if (!feed) throw new NotFoundException(errors.feed.notFound);

    return await this.commentRepository.createComemnt(
      userId,
      feedId,
      comemntCreateDto,
    );
  }

  async updateComemnt(
    commentId,
    comemntUpdateDto: CommentUpdateDto,
  ): Promise<CommentFindOneVo> {
    const comment = await this.commentRepository.findOneComment(commentId);
    if (!comment) throw new NotFoundException(errors.comment.notFound);

    return await this.commentRepository.updateComemnt(
      commentId,
      comemntUpdateDto,
    );
  }

  /**
   * 코멘트 삭제
   * @param feedId
   * @param commentId
   * @returns
   */
  async deleteComemnt(feedId: number, commentId: number) {
    const feed = await this.feedRepository.findOneFeed(feedId);
    if (!feed) throw new NotFoundException(errors.feed.notFound);
    return await this.commentRepository.deleteComemnt(feedId, commentId);
  }
}
