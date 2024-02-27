import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { UserSocial } from './user-social.entity';
import { dataSource } from '../../config';
import { UserSocialCreateDto } from './dto';
import { UserSocialFindOneVo } from './vo';

@Injectable()
export class UserSocialRepository {
  constructor(private readonly userSocialRepository: Repository<UserSocial>) {}

  // SELECTS

  /**
   * 아이디로 찾기
   * @param id
   * @returns UserSocialFindOneVo
   */
  public async findOneByUserId(userId: number): Promise<UserSocialFindOneVo> {
    // transaction 예시
    const user = await this.userSocialRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId: userId })
      .getOne();

    return user;
  }

  // INSERTS

  /**
   * 유저 생성
   * @param userCreateDto
   * @returns UserSocial
   */
  public async createUserSocial(
    userCreateDto: UserSocialCreateDto,
  ): Promise<UserSocial> {
    const user = await dataSource.transaction(async (transaction) => {
      let newUserSocial = new UserSocial(userCreateDto);
      newUserSocial = await transaction.save(newUserSocial);

      return newUserSocial;
    });

    return user;
  }
}
