import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserFindOneVo } from './vo';
import {
  UserCreateDto,
  UserListDto,
  UserUpdateDto,
  UserUpdateStatusDto,
} from './dto';
import { UserDeleteDto } from './dto/user-delete.dto';
import { PaginateResponseVo } from 'src/core';
import { UserBlockRepository } from '../user-block/user-block.repository';
import * as errors from '../../locales/kr/errors.json';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userBlockRepository: UserBlockRepository,
  ) {}

  // GET SERVICES

  /**
   *
   * @param userListDto
   * @returns
   */
  public async findAll(
    userListDto?: UserListDto,
  ): Promise<PaginateResponseVo<UserFindOneVo>> {
    // * 나를 차단한 유저 검색 제외
    const blockedMeUsers = await this.userBlockRepository.findAllByBlockedIds(
      userListDto.viewerId,
    );
    console.log('blockedMeUsers', blockedMeUsers);
    return await this.userRepository.findAll(userListDto, blockedMeUsers);
  }

  /**
   *
   * @param id
   * @returns UserFindOneVo
   */
  public async findOne(id: number): Promise<UserFindOneVo> {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException(errors.user.notFound);
    return user;
  }

  /**
   *
   * @param username
   * @returns UserFindOneVo
   */
  public async findUserByUsername(
    username: string,
    viewerId?: number,
  ): Promise<UserFindOneVo> {
    const user = await this.userRepository.findUserByUsername(
      username,
      viewerId,
    );
    if (!user) throw new NotFoundException(errors.user.notFound);
    return user;
  }

  // INSERT SERVICES

  /**
   * 새로운 사용자 생성
   * @param userCreateDto
   */
  public async createUser(userCreateDto: UserCreateDto) {
    const checkEmail = await this.userRepository.findUserByEmail(
      userCreateDto.email,
    );
    if (checkEmail) throw new ConflictException(errors.user.alreadyEmail);

    const username = await this.userRepository.findUserByUsername(
      userCreateDto.username,
    );
    if (username) throw new ConflictException(errors.user.alreadyUsername);

    await this.userRepository.createUser(userCreateDto);
  }

  /**
   *  사용자 수정
   * @param userUpdateDto
   */
  public async updateUser(id: number, userUpdateDto: UserUpdateDto) {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException(errors.user.notFound);
    await this.userRepository.updateUser(id, userUpdateDto);
  }

  /**
   *  유저 상태 변경
   * @param id
   * @param userUpdateStatusDto
   * @returns
   */
  public async updateUserStatus(
    id: number,
    userUpdateStatusDto: UserUpdateStatusDto,
  ) {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException(errors.user.notFound);

    return this.userRepository.updateUserStatus(id, userUpdateStatusDto);
  }

  /**
   *  계정 활성화
   * @param id
   * @returns
   */
  public async activateUser(id: number) {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException(errors.user.notFound);

    return this.userRepository.activateUser(id);
  }

  /**
   *  계정 삭제
   * @param id
   * @param userDeleteDto
   * @returns
   */
  public async deleteUser(id: number, userDeleteDto: UserDeleteDto) {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException(errors.user.notFound);

    return this.userRepository.deleteUser(id, userDeleteDto);
  }

  public async findAllUsers() {
    return await this.userRepository.findAllUsers();
  }
}
