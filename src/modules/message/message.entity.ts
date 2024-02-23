import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity({ name: 'message' })
export class Message extends BaseEntity<Message> {
  constructor(partial?: Partial<Message>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    name: 'user_id',
  })
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'room_id',
  })
  @IsNotEmpty()
  roomId: number;

  @Column({
    name: 'message',
  })
  @IsNotEmpty()
  message: string;

  @ManyToOne((type) => Room, (room) => room.messages)
  @JoinColumn({ name: 'room_id' })
  room?: Room;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
