import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionGroupService } from './product-option-group.service';

describe('ProductOptionGroupService', () => {
  let service: ProductOptionGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOptionGroupService],
    }).compile();

    service = module.get<ProductOptionGroupService>(ProductOptionGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
