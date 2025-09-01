import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionGroupController } from './product-option-group.controller';

describe('ProductOptionGroupController', () => {
  let controller: ProductOptionGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOptionGroupController],
    }).compile();

    controller = module.get<ProductOptionGroupController>(ProductOptionGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
