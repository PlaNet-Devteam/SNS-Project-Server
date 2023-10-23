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
import { FollowFindOneVo } from './vo';

@Injectable()
export class MapperUserFollowService {
  constructor(
    private readonly mapperUserFollowRepository: MapperUserFollowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAllByFollowings(
    username: string,
    mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<PaginateResponseVo<FollowFindOneVo>> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw new NotFoundException('존재하지 않는 사용자 입니다');
    return await this.mapperUserFollowRepository.findAllByFollowings(
      user.id,
      mapperUserfollowListDto,
    );
  }

  async findAllByFollowers(
    username: string,
    mapperUserfollowListDto: MapperUserFollowListDto,
  ): Promise<PaginateResponseVo<FollowFindOneVo>> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw new NotFoundException('존재하지 않는 사용자 입니다');
    return await this.mapperUserFollowRepository.findAllByFollowers(
      user.id,
      mapperUserfollowListDto,
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
