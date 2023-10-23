import { BasePaginationDto } from 'src/core';
import { User } from 'src/modules/user/user.entity';

export class MapperUserFollowListDto
  extends BasePaginationDto<MapperUserFollowListDto>
  implements Partial<User>
{
  username?: string;
  nickname?: string;
}
