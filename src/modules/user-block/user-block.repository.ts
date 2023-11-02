import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { UserBlock } from './user-block.entity';
import { Repository } from 'typeorm';
import { PaginateResponseVo } from 'src/core';
import { UserBlockCreateDto, UserBlockListDto } from './dto';

@Injectable()
export class UserBlockRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.USER_BLOCK)
    private readonly userBlockRepository: Repository<UserBlock>,
  ) {}

  // SELECTS
  public async findAll(
    userId: number,
    userBlockListDto: UserBlockListDto,
  ): Promise<PaginateResponseVo<UserBlock>> {
    const page = userBlockListDto?.page;
    const limit = userBlockListDto?.limit;
    const offset = (page - 1) * limit;

    const blockUsers = this.userBlockRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blockedUser', 'blockedUser')
      .where('user.userId = :userId', { userId: userId })
      .orderBy('user.createdAt', 'DESC')
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await blockUsers.getManyAndCount();
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
   * 차단된 유저인지 체크
   * @param userId
   * @param viewerId
   * @returns
   */
  public async checkIsBlocked(
    userId: number,
    viewerId: number,
  ): Promise<boolean> {
    const isBlocked = await this.userBlockRepository
      .createQueryBuilder('userBlock')
      .where('userBlock.blockedUserId = :blockedUserId', {
        blockedUserId: userId,
      })
      .andWhere('userBlock.userId = :userId', { userId: viewerId })
      .getExists();
    return isBlocked;
  }

  // INSERT

  /**
   * 차단 유저 생성
   * @param userId
   * @param actionType
   */
  public async createUserBlock(userBlockCreateDto: UserBlockCreateDto) {
    await dataSource.transaction(async (transaction) => {
      const newBlockUser = new UserBlock(userBlockCreateDto);

      await transaction.save(newBlockUser);
    });
  }

  // DELETE

  /**
   * 차단 유저 해제
   * @param userId
   * @param actionType
   */
  public async deleteUserBlock(userBlockCreateDto: UserBlockCreateDto) {
    await dataSource.transaction(async (transaction) => {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(UserBlock)
        .where('userId = :userId', { userId: userBlockCreateDto.userId })
        .andWhere('blockedUserId = :blockedUserId', {
          blockedUserId: userBlockCreateDto.blockedUserId,
        })
        .execute();
    });
  }
}
