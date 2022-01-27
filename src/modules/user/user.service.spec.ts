/*
 * @Descripttion:
 * @version:
 * @Author: situ
 * @Date: 2021-10-24 19:04:15
 * @LastEditors:
 * @LastEditTime: 2021-11-14 22:25:55
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
