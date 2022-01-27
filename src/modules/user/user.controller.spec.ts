/*
 * @Descripttion:
 * @version:
 * @Author: situ
 * @Date: 2021-10-24 19:01:21
 * @LastEditors:
 * @LastEditTime: 2021-11-14 22:26:21
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('UsersController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
