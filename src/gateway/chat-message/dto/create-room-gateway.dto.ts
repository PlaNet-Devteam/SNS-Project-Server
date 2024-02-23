import { MessageCreateDto } from 'src/modules/message/dto';

export class CreateRoomGatewayDto {
  userId: number;
  userIds: number[];
}
