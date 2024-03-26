import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentReplyRepository } from './comment-reply.repository';
import { CommentReply } from './comment-reply.entity';
import {
  CommentReplyCreateDto,
  CommentReplyListDto,
  CommentReplyUpdateDto,
} from './dto';
import { PaginateResponseVo } from 'src/core';
import { CommentReplyFindOneVo } from './vo';
import { CommentRepository } from '../comment/comment.repository';
import * as errors from '../../locales/kr/errors.json';

@Injectable()
export class CommentReplyService {
  constructor(
    private readonly commentReplyRepository: CommentReplyRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  // GET SERVICES

  /**
   *
   * @param commentListDto
   * @returns
   */
  public async findAll(
    commentId: number,
    commentListDto?: CommentReplyListDto,
  ): Promise<PaginateResponseVo<CommentReplyFindOneVo>> {
    const comments = await this.commentReplyRepository.findAll(
      commentId,
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
  public async findOne(comemntId: number): Promise<CommentReplyFindOneVo> {
    const comment = await this.commentReplyRepository.findOneCommentReply(
      comemntId,
    );
    if (!comment) throw new NotFoundException(errors.comment.notFound);
    return comment;
  }

  // INSERT SERVICES

  /**
   * 코멘트 생성
   * @param userId
   * @param commentId
   * @param comemntCreateDto
   * @returns
   */
  async createComemntReply(
    userId: number,
    commentId: number,
    comemntCreateDto: CommentReplyCreateDto,
  ): Promise<CommentReply> {
    const feed = await this.commentRepository.findOneComment(commentId);
    if (!feed) throw new NotFoundException(errors.feed.notFound);

    return await this.commentReplyRepository.createComemntReply(
      userId,
      commentId,
      comemntCreateDto,
    );
  }

  async updateComemntReply(
    commentId,
    comemntUpdateDto: CommentReplyUpdateDto,
  ): Promise<CommentReplyFindOneVo> {
    const comment = await this.commentReplyRepository.findOneCommentReply(
      commentId,
    );
    if (!comment) throw new NotFoundException(errors.comment.notFound);

    return await this.commentReplyRepository.updateComemntReply(
      commentId,
      comemntUpdateDto,
    );
  }

  /**
   * 코멘트 삭제
   * @param commentId
   * @param commentId
   * @returns
   */
  async deleteComemntReply(commentId: number, replyId: number) {
    const feed = await this.commentRepository.findOneComment(commentId);
    if (!feed) throw new NotFoundException(errors.feed.notFound);
    return await this.commentReplyRepository.deleteComemntReply(
      commentId,
      replyId,
    );
  }
}
