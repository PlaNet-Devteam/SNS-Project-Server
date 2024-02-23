import { Entity, Column } from 'typeorm';
import { BaseUpdateEntity } from 'src/core';

@Entity({ name: 'chat_message' })
export class ChatMessage extends BaseUpdateEntity<ChatMessage> {
  constructor(partial?: Partial<ChatMessage>) {
    super();
    Object.assign(this, partial);
  }
  @Column({
    name: 'roomId',
  })
  roomId: string;

  @Column()
  participants: string;

  @Column({
    type: 'json',
  })
  message: [
    {
      sender: number;
      content: string;
      timestamp: string;
    },
  ];
}
