import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    update: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const dto = { name: 'New Name' };
      const result = { id: '1', ...dto };
      mockUsersService.update.mockResolvedValue(result);

      expect(await controller.updateUser('1', dto)).toEqual(result);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', dto);
    });
  });
});
