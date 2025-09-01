import { Test, TestingModule } from '@nestjs/testing';
import { OptionGroupController } from './option-group.controller';

describe('OptionGroupController', () => {
  let controller: OptionGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionGroupController],
    }).compile();

    controller = module.get<OptionGroupController>(OptionGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
