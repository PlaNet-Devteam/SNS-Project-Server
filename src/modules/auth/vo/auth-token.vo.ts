import { BaseVo } from 'src/core';

export class AuthTokenVo extends BaseVo {
  accessToken: string;
  refreshToken: string;
}
