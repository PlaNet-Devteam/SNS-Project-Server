import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { UserBlock } from './user-block.entity';
import { Repository } from 'typeorm';
import { PaginateResponseVo } from 'src/core';
import { UserBlockCreateDto, UserBlockListDto } from './dto';
import { ORDER_BY_VALUE, USER_BLOCK } from 'src/common';

@Injectable()
export class UserBlockRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.USER_BLOCK)
    private readonly userBlockRepository: Repository<UserBlock>,
  ) {}

  // SELECTS

  /**
   * 내가 차단한 유저 목록
   * @param userId
   * @param userBlockListDto
   * @returns
   */
  public async findAll(
    userId: number,
    userBlockListDto: UserBlockListDto,
  ): Promise<PaginateResponseVo<UserBlock>> {
    const page = userBlockListDto?.page;
    const limit = userBlockListDto?.limit;
    const offset = (page - 1) * limit;

    const blockUsers = this.userBlockRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.blockedUser', 'blockedUser')
      .where('user.userId = :userId', { userId: userId })
      .andWhere('user.actionType = :actionType', {
        actionType: USER_BLOCK.BLOCKER,
      })
      .orderBy('user.createdAt', ORDER_BY_VALUE.DESC)
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
   * 내가 차단한 유저 ID 배열
   * @param userId
   * @returns
   */
  public async findAllByBlockerIds(userId: number): Promise<number[]> {
    const users = await UserBlock.createQueryBuilder('userBlock')
      .where('userBlock.userId = :userId', {
        userId,
      })
      .andWhere('userBlock.actionType = :actionType', {
        actionType: USER_BLOCK.BLOCKER,
      })
      .getMany();

    const userIds = users.map((user) => user.blockedUserId);

    return userIds;
  }

  /**
   * 나를 차단한 유저 ID 배열
   * @param userId
   * @returns
   */
  public async findAllByBlockedIds(userId: number): Promise<number[]> {
    const users = await UserBlock.createQueryBuilder('userBlock')
      .where('userBlock.userId = :userId', {
        userId,
      })
      .andWhere('userBlock.actionType = :actionType', {
        actionType: USER_BLOCK.BLOCKED,
      })
      .getMany();

    const userIds = users.map((user) => user.blockedUserId);

    return userIds;
  }

  public async findOne(
    userId: number,
    blockedUserId: number,
  ): Promise<UserBlock> {
    const user = await this.userBlockRepository.findOne({
      where: {
        userId,
        blockedUserId,
      },
    });

    return user;
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
      await transaction
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
