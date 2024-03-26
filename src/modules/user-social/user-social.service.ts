import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSocialRepository } from './user-social.repository';
import { UserSocialFindOneVo } from './vo';
import { UserSocialCreateDto } from './dto';
import * as errors from '../../locales/kr/errors.json';

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
    if (!user) throw new NotFoundException(errors.user.notFound);
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
    if (checkUserId) throw new ConflictException(errors.user.alreadyUser);
    await this.userSocialRepository.createUserSocial(userCreateDto);
  }
}
