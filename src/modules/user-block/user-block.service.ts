import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserBlockCreateDto, UserBlockListDto } from './dto';
import { UserBlockRepository } from './user-block.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class UserBlockService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userBlockRepository: UserBlockRepository,
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
