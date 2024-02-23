import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity({ name: 'mapper_user_room' })
export class MapperUserRoom extends BaseEntity<MapperUserRoom> {
  constructor(partial?: Partial<MapperUserRoom>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'room_id',
  })
  @IsNotEmpty()
  roomId: number;

  @OneToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToOne((type) => Room)
  @JoinColumn({ name: 'room_id' })
  room?: User;
}
