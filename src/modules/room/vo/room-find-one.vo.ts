import { User } from 'src/modules/user/user.entity';
import { Room } from '../room.entity';

export class RoomFindOneVo implements Partial<Room> {
  id: number;
  roomUniqueId: string;
  users?: User[];
}
