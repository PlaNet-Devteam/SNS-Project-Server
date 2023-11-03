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
import { PaginateResponseVo } from 'src/core';
import { YN } from 'src/common';
import { FollowFindOneVo } from './vo';

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
   * 내가 팔로우한 유저 목록
   * @param userId
   * @param mapperUserfollowListDto
   * @returns
   */
  async findAllByFollowings(
    userId: number,
    mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<PaginateResponseVo<FollowFindOneVo>> {
    const page = mapperUserfollowListDto.page;
    const limit = mapperUserfollowListDto.limit;
    const offset = (page - 1) * limit;

    const user = this.mapperUserFollowRepository
      .createQueryBuilder('mapper')
      .leftJoinAndSelect('mapper.following', 'user')
      .where(
        new Brackets((qb) => {
          qb.where('user.username LIKE :query OR user.nickname LIKE :query', {
            query: `%${mapperUserfollowListDto.query}%`,
          });
        }),
      )
      .andWhere('mapper.userId = :userId', {
        userId: userId,
      })
      .andWhere('user.delYn = :delYn', { delYn: YN.N })
      .orderBy('mapper.createdAt', mapperUserfollowListDto.orderBy)
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await user.getManyAndCount();
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
   * 나를 팔로우한 유저 목록
   * @param userId
   * @param mapperUserfollowListDto
   * @returns
   */
  async findAllByFollowers(
    userId: number,
    mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<PaginateResponseVo<FollowFindOneVo>> {
    const page = mapperUserfollowListDto.page;
    const limit = mapperUserfollowListDto.limit;
    const offset = (page - 1) * limit;

    const user = this.mapperUserFollowRepository
      .createQueryBuilder('mapper')
      .leftJoinAndSelect('mapper.follower', 'user')
      .where(
        new Brackets((qb) => {
          qb.where('user.username LIKE :query OR user.nickname LIKE :query', {
            query: `%${mapperUserfollowListDto.query}%`,
          });
        }),
      )
      .andWhere('mapper.followingId = :followingId', {
        followingId: userId,
      })
      .andWhere('user.delYn = :delYn', { delYn: YN.N })
      .orderBy('mapper.createdAt', mapperUserfollowListDto.orderBy)
      .offset(offset)
      .limit(limit);

    const [items, totalCount] = await user.getManyAndCount();
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
      await dataSource
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
