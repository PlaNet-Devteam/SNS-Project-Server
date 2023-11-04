import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { dataSource } from '../../config';
import { UserCreateDto, UserUpdateDto, UserUpdateStatusDto } from './dto';
import { UserHistory } from '../user-history/user-history.entity';
import { HashService } from '../auth/hash.service';
import { MapperUserFollow } from '../mapper-user-follow/mapper-user-follow.entity';
import { USER_STATUS, YN } from 'src/common';
import { UserDeleteDto } from './dto/user-delete.dto';
import { UserBlock } from '../user-block/user-block.entity';

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
  public async findOneUser(id: number): Promise<User> {
    // transaction 예시
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.password', // 비번 확인을 위해서 select -> JSON 변환 시 리스에서 빠짐
        'user.email',
        'user.delYn',
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

    // * 팔로잉 유저
    const followingUsers = await MapperUserFollow.createQueryBuilder('mapper')
      .where('mapper.userId = :userId', { userId: id })
      .getMany();
    if (followingUsers.length > 0)
      user.followingIds = followingUsers.map((follow) => follow.followingId);

    // * 팔로워 유저
    const followerUsers = await MapperUserFollow.createQueryBuilder('mapper')
      .where('mapper.followingId = :followingId', { followingId: id })
      .getMany();
    if (followerUsers.length > 0)
      user.followerIds = followerUsers.map((follow) => follow.userId);

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
      .where('user.email = :email', { email: email })
      .getOne();

    return user;
  }

  /**
   * 유저명으로 존재하는지 확인
   * @param username
   * @returns User
   */
  public async findUserByUsername(
    username: string,
    viewerId?: number,
  ): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .andWhere('user.delYn = :delYn', { delYn: YN.N })
      .getOne();

    // * 나를 차다한 유저 프로필 검색 불가
    if (user && viewerId) {
      const blockedMe = await UserBlock.createQueryBuilder('userBlock')
        .where('userBlock.userId = :userId', { userId: user.id })
        .andWhere('userBlock.blockedUserId = :blockedUserId', {
          blockedUserId: viewerId,
        })
        .getOne();

      if (blockedMe)
        throw new NotFoundException('존재 하지 않는 사용자 입니다');
    }

    // * 팔로잉 유저
    if (user) {
      const followingUsers = await MapperUserFollow.createQueryBuilder('mapper')
        .where('mapper.userId = :userId', { userId: user.id })
        .getMany();
      if (followingUsers && followingUsers.length > 0) {
        user.followingIds = followingUsers.map((follow) => follow.followingId);
      } else {
        user.followingIds = [];
      }
    }

    // * 팔로워 유저
    if (user) {
      const followerUsers = await MapperUserFollow.createQueryBuilder('mapper')
        .where('mapper.followingId = :followingId', { followingId: user.id })
        .getMany();
      if (followerUsers && followerUsers.length > 0) {
        user.followerIds = followerUsers.map((follow) => follow.userId);
      } else {
        user.followerIds = [];
      }
    }

    // * 차단 여부 by Viewer (로그인 한 유저)
    if (user && viewerId) {
      const isBlocked = await UserBlock.createQueryBuilder('userBlock')
        .where('userBlock.blockedUserId = :blockedUserId', {
          blockedUserId: user.id,
        })
        .andWhere('userBlock.userId = :userId', { userId: viewerId })
        .getExists();

      user.isBlockedByViewer = isBlocked;
    }

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
   * 유저 생성
   * @param userCreateDto
   * @returns User
   */
  public async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      // * 비밀번호 암호화
      userCreateDto.password = await this.hashService.hashString(
        userCreateDto.password,
      );
      let newUser = new User(userCreateDto);
      newUser = await transaction.save(newUser);

      // * 유저 히스토리 업데이트
      const userHistory = this.__user_update_history(newUser.id, newUser);
      await transaction.save(userHistory);

      return newUser;
    });

    return user;
  }

  // UPDATE

  /**
   * 유저 정보 수정
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
      updatedUser.profileImage = userUpdateDto.profileImage;
      updatedUser = await transaction.save(updatedUser);

      // * 유저 히스토리 업데이트
      const userHistory = this.__user_update_history(
        updatedUser.id,
        updatedUser,
      );
      await transaction.save(userHistory);

      return updatedUser;
    });

    return user;
  }

  /**
   * 유저 상태 수정
   * @param id
   * @param userUpdateStatusDto
   * @returns
   */
  public async updateUserStatus(
    id: number,
    userUpdateStatusDto: UserUpdateStatusDto,
  ): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      let updatedUser = await this.userRepository.findOne({
        where: { id: id },
      });

      updatedUser.status = userUpdateStatusDto.status;
      if (userUpdateStatusDto.status === USER_STATUS.INACTIVE) {
        updatedUser.inactiveAt = new Date();
      }
      updatedUser = await transaction.save(updatedUser);

      // * 유저 히스토리 업데이트
      const userHistory = this.__user_update_history(
        updatedUser.id,
        updatedUser,
      );
      await transaction.save(userHistory);

      return updatedUser;
    });

    return user;
  }

  /**
   * 유저 비밀번호 수정
   * @param id
   * @param newPassword
   * @returns
   */
  public async updatePassword(id: number, newPassword: string): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      let updatedUser = await this.userRepository.findOne({
        where: { id: id },
      });
      updatedUser.password = newPassword;
      updatedUser = await this.userRepository.save(updatedUser);

      return updatedUser;
    });

    return user;
  }

  /**
   * 계정 삭제 취소 (delYn => N )
   * @param id
   * @param userUpdateStatusDto
   * @returns
   */
  public async activateUser(id: number): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      let updatedUser = await this.userRepository.findOne({
        where: { id: id },
      });

      updatedUser.status = USER_STATUS.ACTIVE;
      updatedUser.inactiveAt = null;
      updatedUser.delYn = YN.N;
      updatedUser = await transaction.save(updatedUser);

      // TODO : 나를 팔로워한 유저의 FOLLOWER COUNT 증가

      // * 유저 히스토리 업데이트
      const userHistory = this.__user_update_history(
        updatedUser.id,
        updatedUser,
      );

      await transaction.save(userHistory);

      return updatedUser;
    });

    return user;
  }

  /**
   * 계정 삭제 ( delYn => Y )
   * @param id
   * @param userDeleteDto
   * @returns
   */
  public async deleteUser(
    id: number,
    userDeleteDto: UserDeleteDto,
  ): Promise<User> {
    const user = await dataSource.transaction(async (transaction) => {
      let updatedUser = await this.userRepository.findOne({
        where: { id: id, delYn: YN.N },
      });

      // * 유저 상태 비활성화 & 삭제 여부 Y
      updatedUser.status = USER_STATUS.INACTIVE;
      updatedUser.delYn = YN.Y;
      updatedUser = await transaction.save(updatedUser);

      // TODO : 나를 팔로워한 유저의 FOLLOWER COUNT 감소

      // * 유저 히스토리 업데이트
      const userHistory = this.__user_update_history(
        updatedUser.id,
        updatedUser,
      );
      await transaction.save(userHistory);

      return updatedUser;
    });

    return user;
  }

  /**
   * 최근 로그인 날짜
   * @param id
   * @returns
   */
  async updateLoginDate(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    user.lastLoginAt = new Date();
    this.userRepository.save(user);
    return user;
  }

  /**
   *
   * @returns
   */
  async findAllUsers() {
    return await this.userRepository.find(); // 모든 유저 정보를 가져옵니다.
  }

  /**
   * 유저 히스토리 업데이트
   */
  private __user_update_history(userId: number, user: User) {
    const userHistory = new UserHistory().set(user);
    userHistory.userId = userId;
    userHistory.createdAt = new Date();
    return userHistory;
  }
}
