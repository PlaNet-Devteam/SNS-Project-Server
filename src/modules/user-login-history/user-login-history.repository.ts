import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/config';

import { USER_LOGIN } from 'src/common';
import { UserLoginHistory } from './user-login-history.entity';

@Injectable()
export class UserLoginHistoryRepository {
  constructor() {}

  // INSERT

  /**
   * 새로운 기록 생성
   * @param userId
   * @param actionType
   * @param deviceId
   */
  public async createLoginHistory(loginHistory: UserLoginHistory) {
    await dataSource.transaction(async (transaction) => {
      const newHistory = new UserLoginHistory(loginHistory);

      await transaction.save(newHistory);
    });
  }
}
