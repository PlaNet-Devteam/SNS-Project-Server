import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { CommentCreateDto, CommentListDto } from './dto';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { Feed } from '../feed/feed.entity';
import { PaginateResponseVo } from 'src/core';
import { CommentFindOneVo } from './vo';

@Injectable()
export class CommentRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.COMMENT)
    private readonly commentRepository: Repository<Comment>,
    @Inject(DB_CONST_REPOSITORY.FEED)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  // SELECTS

  /**
   * 피드별 코멘트 목록
   * @returns
   */
  public async findAll(
    feedId: number,
    commentListDto?: CommentListDto,
  ): Promise<PaginateResponseVo<CommentFindOneVo>> {
    const page = commentListDto?.page;
    const limit = commentListDto?.limit;
    const offset = (page - 1) * limit;

    const comments = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'comment.id',
        'comment.feedId',
        'comment.userId',
        'comment.comment',
        'comment.replyCount',
        'comment.createdAt',
        'comment.updatedAt',
        'user.id',
        'user.username',
        'user.nickname',
        'user.profileImage',
      ])
      .where('comment.feedId = :feedId', { feedId: feedId })
      .orderBy('comment.createdAt', 'ASC')
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await comments.getManyAndCount();
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

  // INSERTS

  /**
   *
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
    const comment = await dataSource.transaction(async (transaction) => {
      let newComment = new Comment(comemntCreateDto);
      newComment.userId = userId;
      newComment.feedId = feedId;
      newComment = await transaction.save(newComment);

      // feed reply count 증가
      let feed = await this.feedRepository.findOne({
        where: { id: feedId },
      });

      feed.commentCount++;
      feed = await transaction.save(feed);

      return newComment;
    });

    return comment;
  }
}
