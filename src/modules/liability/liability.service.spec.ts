import { Test, TestingModule } from '@nestjs/testing';
import { LiabilityService } from './liability.service';

describe('LiabilityService', () => {
  let service: LiabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiabilityService],
    }).compile();

    service = module.get<LiabilityService>(LiabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
