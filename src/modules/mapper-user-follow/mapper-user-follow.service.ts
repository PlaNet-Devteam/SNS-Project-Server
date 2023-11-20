import { Injectable, NotFoundException } from '@nestjs/common';
import { MapperUserFollowRepository } from './mapper-user-follow.repository';
import {
  MapperUserFollowCreateDto,
  MapperUserFollowDeleteDto,
  MapperUserFollowListDto,
} from './dto';
import { UserRepository } from '../user/user.repository';
import { MapperUserFollow } from './mapper-user-follow.entity';
import { PaginateResponseVo } from 'src/core';
import { UserFindOneVo } from '../user/vo';
import { UserBlockRepository } from '../user-block/user-block.repository';
import { User } from '../user/user.entity';

@Injectable()
export class MapperUserFollowService {
  constructor(
    private readonly mapperUserFollowRepository: MapperUserFollowRepository,
    private readonly userRepository: UserRepository,
    private readonly userBlockRepository: UserBlockRepository,
  ) {}

  async findAllByFollowings(
    user: User,
    username: string,
    mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<PaginateResponseVo<UserFindOneVo>> {
    const profileUser = await this.userRepository.findUserByUsername(username);

    // *  나를 차단한 유저 검색 제외
    const blockedMeUsers = await this.userBlockRepository.findAllByBlockedIds(
      user.id,
    );
    const excludeUserIds = [...blockedMeUsers];

    if (!profileUser)
      throw new NotFoundException('존재하지 않는 사용자 입니다');
    return await this.mapperUserFollowRepository.findAllByFollowings(
      user.id,
      profileUser.id,
      mapperUserfollowListDto,
      excludeUserIds,
    );
  }

  async findAllByFollowers(
    user: User,
    username: string,
    mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<PaginateResponseVo<UserFindOneVo>> {
    const profileUser = await this.userRepository.findUserByUsername(username);
    if (!profileUser)
      throw new NotFoundException('존재하지 않는 사용자 입니다');

    // *  나를 차단한 유저 검색 제외
    const blockedMeUsers = await this.userBlockRepository.findAllByBlockedIds(
      user.id,
    );
    const excludeUserIds = [...blockedMeUsers];

    return await this.mapperUserFollowRepository.findAllByFollowers(
      user.id,
      profileUser.id,
      mapperUserfollowListDto,
      excludeUserIds,
    );
  }

  async createMapperUserFollow(
    mapperUserFollowCreateDto: MapperUserFollowCreateDto,
  ): Promise<MapperUserFollow> {
    const followingUser = this.userRepository.findOneUser(
      mapperUserFollowCreateDto.followingId,
    );
    if (!followingUser)
      throw new NotFoundException('존재하지 않는 사용자 입니다');
    return this.mapperUserFollowRepository.createMapperUserFollow(
      mapperUserFollowCreateDto,
    );
  }

  async deleteMapperUserFollow(
    mapperUserFollowDeleteDto: MapperUserFollowDeleteDto,
  ) {
    const followingUser = this.userRepository.findOneUser(
      mapperUserFollowDeleteDto.followingId,
    );
    if (!followingUser)
      throw new NotFoundException('존재하지 않는 사용자 입니다');
    return this.mapperUserFollowRepository.deleteMapperUserFollow(
      mapperUserFollowDeleteDto,
    );
  }
}
