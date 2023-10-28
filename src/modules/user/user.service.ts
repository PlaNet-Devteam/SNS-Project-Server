import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserFindOneVo } from './vo';
import { UserCreateDto, UserUpdateDto, UserUpdateStatusDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // GET SERVICES

  /**
   *
   * @param id
   * @returns UserFindOneVo
   */
  public async findOne(id: number): Promise<UserFindOneVo> {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  /**
   *
   * @param username
   * @returns UserFindOneVo
   */
  public async findUserByUsername(username: string): Promise<UserFindOneVo> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw new NotFoundException('존재 하지 않는 사용자 입니다');
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
    if (checkEmail) throw new BadRequestException();
    await this.userRepository.createUser(userCreateDto);
  }

  /**
   *  사용자 수정
   * @param userUpdateDto
   */
  public async updateUser(id: number, userUpdateDto: UserUpdateDto) {
    const user = await this.userRepository.findOneUser(id);
    if (!user) throw new NotFoundException('존재 하지 않는 사용자 입니다');
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
    if (!user) throw new NotFoundException('존재 하지 않는 사용자 입니다');

    return this.userRepository.updateUserStatus(id, userUpdateStatusDto);
  }

  public async findAllUsers() {
    return await this.userRepository.findAllUsers();
  }
}
