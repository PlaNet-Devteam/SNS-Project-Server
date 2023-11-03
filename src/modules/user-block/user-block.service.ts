import { Injectable, NotFoundException } from '@nestjs/common';
import { UserBlockCreateDto, UserBlockListDto } from './dto';
import { UserBlockRepository } from './user-block.repository';
import { UserRepository } from '../user/user.repository';
import { MapperUserFollowRepository } from '../mapper-user-follow/mapper-user-follow.repository';
import { MapperUserFollowDeleteDto } from '../mapper-user-follow/dto';

@Injectable()
export class UserBlockService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userBlockRepository: UserBlockRepository,
    private readonly mapperUserFollowRepository: MapperUserFollowRepository,
  ) {}

  // GET SERVICES

  public async findAll(userId: number, userBlockListDto: UserBlockListDto) {
    return await this.userBlockRepository.findAll(userId, userBlockListDto);
  }

  // INSERT SERVICES

  /**
   * 차단 유저 생성
   * @param userBlockCreateDto
   */
  public async createUserBlock(userBlockCreateDto: UserBlockCreateDto) {
    const newBlockUser = await this.userRepository.findOneUser(
      userBlockCreateDto.blockedUserId,
    );
    if (!newBlockUser)
      throw new NotFoundException('존재 하지 않는 사용자 입니다');

    // * 차단한 유저 팔로잉 취소
    const isfollowing = await this.mapperUserFollowRepository.findOne(
      userBlockCreateDto.userId,
      userBlockCreateDto.blockedUserId,
    );

    if (isfollowing) {
      await this.mapperUserFollowRepository.deleteMapperUserFollow(
        new MapperUserFollowDeleteDto({
          userId: userBlockCreateDto.userId,
          followingId: userBlockCreateDto.blockedUserId,
        }),
      );
    }

    // * 차단한 유저의 팔로워 취소
    const isfollower = await this.mapperUserFollowRepository.findOne(
      userBlockCreateDto.blockedUserId,
      userBlockCreateDto.userId,
    );

    if (isfollower) {
      await this.mapperUserFollowRepository.deleteMapperUserFollow(
        new MapperUserFollowDeleteDto({
          userId: userBlockCreateDto.blockedUserId,
          followingId: userBlockCreateDto.userId,
        }),
      );
    }

    await this.userBlockRepository.createUserBlock(userBlockCreateDto);
  }

  /**
   * 차단 유저 해제
   * @param userBlockCreateDto
   */
  public async deleteUserBlock(userBlockCreateDto: UserBlockCreateDto) {
    const blcokedUser = await this.userRepository.findOneUser(
      userBlockCreateDto.blockedUserId,
    );
    if (!blcokedUser)
      throw new NotFoundException('존재 하지 않는 사용자 입니다');
    await this.userBlockRepository.deleteUserBlock(userBlockCreateDto);
  }
}
