import { USER_BLOCK } from 'src/common';
import { UserBlock } from '../user-block.entity';

export class UserBlockFindOneVo implements Partial<UserBlock> {
  userId: number;
  blockedUserId: number;
  actionType: USER_BLOCK;
}
