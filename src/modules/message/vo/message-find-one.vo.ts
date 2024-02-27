import { User } from 'src/modules/user/user.entity';
import { Message } from '../message.entity';

export class MessageFindOneVo implements Partial<Message> {
  id: number;
  roomUniqueId: string;
  user: User;
}
