import { Injectable } from '@nestjs/common';
import { RCode } from '../../libs/common/constant/rcode';

@Injectable()
export class UsersService {
  async option(): Promise<any> {
    return {
      data: {
        title: '用户管理',
        addBtn: false,
        column: [{ prop: 'username', label: '用户名' }],
      },
      code: RCode.OK,
    };
  }
}
