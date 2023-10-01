import { Test, TestingModule } from '@nestjs/testing';
import { TrainService } from './train.service';
import { PrismaModule } from '../prisma';

describe('TrainService', () => {
  let service: TrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TrainService],
    }).compile();

    service = module.get<TrainService>(TrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
