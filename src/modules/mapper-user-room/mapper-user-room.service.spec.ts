import { Test, TestingModule } from '@nestjs/testing';
import { MapperUserRoomService } from './mapper-user-room.service';

describe('MapperUserRoomService', () => {
  let service: MapperUserRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapperUserRoomService],
    }).compile();

    service = module.get<MapperUserRoomService>(MapperUserRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
