import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// decorator로 사용자 정보 구하기
export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
