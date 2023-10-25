import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import {
  CommentReplyCreateDto,
  CommentReplyListDto,
  CommentReplyUpdateDto,
} from './dto';
import { CommentReply } from './comment-reply.entity';
import { Repository } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { PaginateResponseVo } from 'src/core';
import { CommentReplyFindOneVo } from './vo';

@Injectable()
export class CommentReplyRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.COMMENT_REPLY)
    private readonly commentReplyRepository: Repository<CommentReply>,
    @Inject(DB_CONST_REPOSITORY.COMMENT)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // SELECTS

  /**
   * 피드별 코멘트 목록
   * @returns
   */
  public async findAll(
    commentId: number,
    commentReplyListDto?: CommentReplyListDto,
  ): Promise<PaginateResponseVo<CommentReplyFindOneVo>> {
    const page = commentReplyListDto?.page;
    const limit = commentReplyListDto?.limit;
    const offset = (page - 1) * limit;

    const commentReplies = this.commentReplyRepository
      .createQueryBuilder('commentReply')
      .leftJoinAndSelect('commentReply.user', 'user')
      .select([
        'commentReply.id',
        'commentReply.commentId',
        'commentReply.userId',
        'commentReply.comment',
        'commentReply.createdAt',
        'commentReply.updatedAt',
        'user.id',
        'user.username',
        'user.nickname',
        'user.profileImage',
      ])
      .where('commentReply.commentId = :commentId', { commentId: commentId })
      .orderBy('commentReply.createdAt', commentReplyListDto.orderBy)
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await commentReplies.getManyAndCount();
    const lasPage = Math.ceil(totalCount / limit);

    return {
      items: items,
      totalCount: totalCount,
      pageInfo: {
        page,
        limit,
        isLast: page === lasPage ? true : false,
      },
    };
  }

  /**
   * 코멘트 상세
   * @param id
   * @returns CommentReplyFindOneVo
   */
  public async findOneCommentReply(id: number): Promise<CommentReplyFindOneVo> {
    const commentReply = await this.commentReplyRepository
      .createQueryBuilder('commentReply')
      .leftJoinAndSelect('commentReply.user', 'user')
      .select([
        'commentReply.id',
        'commentReply.userId',
        'commentReply.commentId',
        'commentReply.comment',
        'commentReply.createdAt',
        'commentReply.updatedAt',
        'user.id',
        'user.username',
        'user.nickname',
        'user.profileImage',
      ])
      .where('commentReply.id = :id', { id: id })
      .getOne();

    return commentReply;
  }

  // INSERTS

  /**
   *
   * @param userId
   * @param feedId
   * @param comemntCreateDto
   * @returns
   */
  async createComemntReply(
    userId: number,
    commentId: number,
    comemntCreateDto: CommentReplyCreateDto,
  ): Promise<CommentReply> {
    const commentReply = await dataSource.transaction(async (transaction) => {
      let newCommentReply = new CommentReply(comemntCreateDto);
      newCommentReply.userId = userId;
      newCommentReply.commentId = commentId;
      newCommentReply = await transaction.save(newCommentReply);

      // comment reply count 증가
      let comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      comment.replyCount++;
      comment = await transaction.save(comment);

      return newCommentReply;
    });

    return commentReply;
  }

  /**
   *
   * @param replyId
   * @param comemntUpdateDto
   */
  async updateComemntReply(
    replyId: number,
    comemntUpdateDto: CommentReplyUpdateDto,
  ): Promise<CommentReplyFindOneVo> {
    const commentReply = await dataSource.transaction(async (transaction) => {
      const commentReply = await this.findOneCommentReply(replyId);
      commentReply.comment = comemntUpdateDto.comment;
      await transaction.save(commentReply);
      return commentReply;
    });
    return commentReply;
  }

  /**
   *
   * @param feedId
   * @param commentReplyId
   */
  async deleteComemntReply(commentId: number, replyId: number) {
    await dataSource.transaction(async (transaction) => {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(CommentReply)
        .where('id = :id', { id: replyId })
        .execute();

      // feed reply count 감소
      let comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      comment.replyCount--;
      comment = await transaction.save(comment);
    });
  }
}
