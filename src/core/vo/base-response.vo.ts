import { RESPONSE_STATUS } from 'src/common';

export class BaseResponseVo<T> {
  constructor(data?: any) {
    this.data = data;
  }
  status: RESPONSE_STATUS = RESPONSE_STATUS.SUCCESS;
  data: T | T[];
  error?: string | string[];
  namespace?: string | string[];

  toJSON() {
    this &&
      Object.keys(this).map((key) => {
        if (this[key] && this[key] === null) delete this[key];
      });

    return this;
  }
}
