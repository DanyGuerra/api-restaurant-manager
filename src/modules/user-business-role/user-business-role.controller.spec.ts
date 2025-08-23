import { Test, TestingModule } from '@nestjs/testing';
import { UserBusinessRoleController } from './user-business-role.controller';

describe('UserBusinessRoleController', () => {
  let controller: UserBusinessRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBusinessRoleController],
    }).compile();

    controller = module.get<UserBusinessRoleController>(UserBusinessRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
