import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY, dataSource } from 'src/config';
import { Brackets, Repository } from 'typeorm';
import {
  MapperUserFollowCreateDto,
  MapperUserFollowDeleteDto,
  MapperUserFollowListDto,
} from './dto';
import { MapperUserFollow } from './mapper-user-follow.entity';
import { User } from '../user/user.entity';
import { PaginateResponseVo, generatePaginatedResponse } from 'src/core';
import { ORDER_BY_VALUE, YN } from 'src/common';
import { UserFindOneVo } from '../user/vo';

@Injectable()
export class MapperUserFollowRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.MAPPER_USER_FOLLOW)
    private readonly mapperUserFollowRepository: Repository<MapperUserFollow>,
    @Inject(DB_CONST_REPOSITORY.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  // SELECTS
  /**
   * 팔로잉 유저 목록
   * @param userId
   * @param mapperUserfollowListDto
   * @returns
   */
  async findAllByFollowings(
    userId: number,
    followId: number,
    mapperUserfollowListDto: MapperUserFollowListDto,
    excludeUserIds?: number[],
  ): Promise<PaginateResponseVo<UserFindOneVo>> {
    const users = this.mapperUserFollowRepository
      .createQueryBuilder('mapper')
      .innerJoinAndSelect('mapper.following', 'user')
      .where(
        new Brackets((qb) => {
          qb.where('user.username LIKE :query OR user.nickname LIKE :query', {
            query: `%${mapperUserfollowListDto.query}%`,
          });
        }),
      )
      .andWhere('user.delYn = :delYn', { delYn: YN.N })
      .andWhere('mapper.userId = :userId', {
        userId: followId,
      });

    if (excludeUserIds.length > 0) {
      users.andWhere('mapper.followingId NOT IN (:...excludeUserIds)', {
        excludeUserIds,
      });
    }

    // * 본인 프로필 페이지 아닌 경우에만 적용
    if (followId !== userId) {
      users
        .orderBy(
          'CASE WHEN mapper.followingId = :followingId THEN 0 ELSE 1 END',
          ORDER_BY_VALUE.ASC,
        )
        .setParameter('followingId', userId);
    }

    const [items, totalCount] = await users
      .Paginate(mapperUserfollowListDto)
      .getManyAndCount();

    return generatePaginatedResponse(
      items.map((item) => item.following),
      totalCount,
      mapperUserfollowListDto.page,
      mapperUserfollowListDto.limit,
    );
  }

  // * 팔로잉한 유저
  async findOne(userId: number, followingId: number) {
    const user = await this.mapperUserFollowRepository.findOne({
      where: {
        userId,
        followingId,
      },
    });

    return user;
  }

  /**
   * 팔로워 유저 목록
   * @param userId
   * @param mapperUserfollowListDto
   * @returns
   */
  async findAllByFollowers(
    userId: number,
    followId: number,
    mapperUserfollowListDto: MapperUserFollowListDto,
    excludeUserIds?: number[],
  ): Promise<PaginateResponseVo<UserFindOneVo>> {
    const users = this.mapperUserFollowRepository
      .createQueryBuilder('mapper')
      .innerJoinAndSelect('mapper.follower', 'user')
      .where(
        new Brackets((qb) => {
          qb.where('user.username LIKE :query OR user.nickname LIKE :query', {
            query: `%${mapperUserfollowListDto.query}%`,
          });
        }),
      )
      .andWhere('user.delYn = :delYn', { delYn: YN.N })
      .andWhere('mapper.followingId = :followingId', {
        followingId: followId,
      });

    if (excludeUserIds.length > 0) {
      users.andWhere('mapper.userId NOT IN (:...excludeUserIds)', {
        excludeUserIds,
      });
    }

    // * 본인 프로필 페이지 아닌 경우에만 적용
    if (followId !== userId) {
      users
        .orderBy(
          'CASE WHEN user.id = :userId THEN 0 ELSE 1 END',
          ORDER_BY_VALUE.ASC,
        )
        .setParameter('userId', userId);
    }

    const [items, totalCount] = await users
      .Paginate(mapperUserfollowListDto)
      .getManyAndCount();

    return generatePaginatedResponse(
      items.map((item) => item.follower),
      totalCount,
      mapperUserfollowListDto.page,
      mapperUserfollowListDto.limit,
    );
  }

  // INSERTS

  /**
   * 팔로우
   * @param mapperUserFollowCreateDto
   * @returns
   */
  async createMapperUserFollow(
    mapperUserFollowCreateDto: MapperUserFollowCreateDto,
  ): Promise<MapperUserFollow> {
    const following = await dataSource.transaction(async (transaction) => {
      let newFollowing = new MapperUserFollow(mapperUserFollowCreateDto);
      newFollowing = await transaction.save(newFollowing);
      // user의 following count 증가
      let user = await this.userRepository.findOne({
        where: { id: mapperUserFollowCreateDto.userId },
      });

      user.followingCount++;
      user = await transaction.save(user);
      // following한 user 의 follower count 증가'
      let followingUser = await this.userRepository.findOne({
        where: {
          id: mapperUserFollowCreateDto.followingId,
        },
      });

      followingUser.followerCount++;
      followingUser = await transaction.save(followingUser);

      return newFollowing;
    });

    return following;
  }

  /**
   * 언팔로우
   * @param mapperUserFollowDeleteDto
   * @returns
   */
  async deleteMapperUserFollow(
    mapperUserFollowDeleteDto: MapperUserFollowDeleteDto,
  ) {
    await dataSource.transaction(async (transaction) => {
      await transaction
        .createQueryBuilder()
        .delete()
        .from(MapperUserFollow)
        .where('userId = :userId', { userId: mapperUserFollowDeleteDto.userId })
        .andWhere('followingId = :followingId', {
          followingId: mapperUserFollowDeleteDto.followingId,
        })
        .execute();

      // user의 following count 감소
      let user = await this.userRepository.findOne({
        where: { id: mapperUserFollowDeleteDto.userId },
      });

      user.followingCount--;
      user = await transaction.save(user);
      // following한 user 의 follower count 감소'
      let followingUser = await this.userRepository.findOne({
        where: {
          id: mapperUserFollowDeleteDto.followingId,
        },
      });

      followingUser.followerCount--;
      followingUser = await transaction.save(followingUser);
    });
  }
}
