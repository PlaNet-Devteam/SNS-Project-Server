export class BaseVo {
  constructor(partial?: any) {
    Object.assign(this, partial);
  }
}
