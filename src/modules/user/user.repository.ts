import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserFindOneVo } from './vo';
import { dataSource } from '../../config';
import { UserCreateDto, UserUpdateDto } from './dto';
import { UserHistory } from '../user-history/user-history.entity';
import { HashService } from '../auth/hash.service';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.USER)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  // SELECTS

  /**
   * 아이디로 찾기
   * @param id
   * @returns UserFindOneVo
   */
  public async findOneUser(id: number): Promise<UserFindOneVo> {
    // transaction 예시
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.password', // 비번 확인을 위해서 select -> JSON 변환 시 리스에서 빠짐
        'user.email',
        'user.nickname',
        'user.followingCount',
        'user.feedCount',
        'user.followerCount',
        'user.bio',
        'user.profileImage',
        'user.status',
        'user.gender',
      ])
      .where('user.id = :id', { id: id })
      .getOne();

    return user;
  }

  /**
   * 이메일로 존재하는지 확인
   * @param email
   * @returns User
   */
  public async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.password',
        'user.status',
        'user.nickname',
        'user.username',
      ])
      .where('user.email = :email', { email: email })
      .getOne();

    return user;
  }

  /**
   * 사용자명으로 존재하는지 확인
   * @param username
   * @returns User
   */
  public async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.password',
        'user.status',
        'user.nickname',
        'user.username',
      ])
      .where('user.username = :username', { username: username })
      .getOne();

    return user;
  }

  /**
   *
   * @param password
   * @param hashedPassword
   * @returns
   */
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const check = await this.hashService.validate(password, hashedPassword);
    if (!check) throw new BadRequestException('password does not match');
    return check;
  }

  // INSERTS

  /**
   * 사용자 생성
   * @param userCreateDto
   * @returns User
   */
  public async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      // 비번 암호화
      userCreateDto.password = await this.hashService.hashString(
        userCreateDto.password,
      );
      let newUser = new User(userCreateDto);
      // TODO: profile image  생성
      newUser = await transaction.save(newUser);
      const userHistory = new UserHistory().set(newUser);
      userHistory.userId = newUser.id;
      await transaction.save(userHistory);

      return newUser;
    });

    return user;
  }

  // UPDATE

  /**
   * 사용자 정보 수정
   * @param id
   * @param userUpdateDto
   * @returns
   */
  public async updateUser(
    id: number,
    userUpdateDto: UserUpdateDto,
  ): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      let updatedUser = await this.userRepository.findOne({
        where: { id: id },
      });

      updatedUser.bio = userUpdateDto.bio;
      updatedUser.nickname = userUpdateDto.nickname;
      updatedUser.gender = userUpdateDto.gender;
      updatedUser = await transaction.save(updatedUser);

      const userHistory = new UserHistory().set(updatedUser);
      userHistory.userId = updatedUser.id;
      userHistory.createdAt = new Date();
      await transaction.save(userHistory);

      return updatedUser;
    });

    return user;
  }
}
