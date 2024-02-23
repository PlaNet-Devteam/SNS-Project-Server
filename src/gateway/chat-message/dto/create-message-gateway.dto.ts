import { MessageCreateDto } from 'src/modules/message/dto';

export class CreateMessageGatewayDto {
  roomUniqueId: string;
  message: MessageCreateDto;
}
