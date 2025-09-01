import { Test, TestingModule } from '@nestjs/testing';
import { OptionGroupService } from './option-group.service';

describe('OptionGroupService', () => {
  let service: OptionGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionGroupService],
    }).compile();

    service = module.get<OptionGroupService>(OptionGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
