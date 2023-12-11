import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';

@Entity({ name: 'room' })
export class Room extends BaseEntity<Room> {
  constructor(partial?: Partial<Room>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    name: 'room_unique_id',
  })
  @IsNotEmpty()
  @MaxLength(60)
  roomUniqueId: string;

  @ManyToMany((type) => User, (user) => user.rooms)
  @JoinTable({
    name: 'mapper_user_room',
    joinColumn: {
      name: 'room_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  users?: User[];

  @OneToMany((type) => Message, (messages) => messages.room)
  messages?: Message[];

  // no database
  userIds?: number[];
}
