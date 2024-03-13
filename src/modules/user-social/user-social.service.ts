import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSocialRepository } from './user-social.repository';
import { UserSocialFindOneVo } from './vo';
import { UserSocialCreateDto } from './dto';

@Injectable()
export class UserSocialService {
  constructor(private readonly userSocialRepository: UserSocialRepository) {}

  // GET SERVICES

  /**
   * 사용자 상세
   * @param id
   * @returns UserSocialFindOneVo
   */
  public async findOne(id: number): Promise<UserSocialFindOneVo> {
    const user = await this.userSocialRepository.findOneByUserId(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  // INSERT SERVICES

  /**
   * 새로운 사용자 생성
   * @param userCreateDto
   */
  public async createUser(userCreateDto: UserSocialCreateDto) {
    const checkUserId = await this.userSocialRepository.findOneByUserId(
      userCreateDto.userId,
    );
    if (checkUserId) throw new BadRequestException('이미 존재하는 유저입니다');
    await this.userSocialRepository.createUserSocial(userCreateDto);
  }
}
