import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'chat_room' })
export class ChatRoom extends BaseEntity<ChatRoom> {
  constructor(chatRoomInfo?: Partial<ChatRoom>) {
    super();
    Object.assign(this, chatRoomInfo);
  }

  @Column({
    name: 'user1',
  })
  user1: number;

  @Column({
    name: 'user2',
  })
  user2: number;

  @Column({
    name: 'user1Name',
  })
  user1Name: string;

  @Column({
    name: 'user2Name',
  })
  user2Name: string;

  @Column({
    name: 'roomId',
  })
  roomId: string;
}
