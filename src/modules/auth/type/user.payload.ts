import { USER_STATUS } from 'src/common';

export interface UserPayload {
  _id: number;
  nickname: string;
  username: string;
  email: string;
  status: USER_STATUS;
}
