import { Injectable } from '@nestjs/common';
import { RCode } from '../../utils/rcode';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '@app/db/models/user.model';
import { makeSalt, encryptPassword } from '../../utils/cryptogram';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: ReturnModelType<typeof User>,
  ) {}
  /**
   * @name: 获取用户信息
   * @msg:
   * @param username 用户名
   * @return {*}
   */
  async findOneByUserName(username: string): Promise<any | undefined> {
    try {
      const user = await this.userModel.findOne({ username });
      return user;
    } catch (error) {
      console.error(error);
      return void 0;
    }
  }
  /**
   * @name: 注册
   * @msg:
   * @param requestBody 请求体
   * @return {*}
   */
  async register(requestBody: any): Promise<any> {
    const { username, password, repassword } = requestBody;
    if (password !== repassword) {
      return {
        code: RCode.FAIL,
        message: '两次密码输入不一致',
      };
    }
    const user = await this.findOneByUserName(username);
    if (user) {
      return {
        code: RCode.FAIL,
        message: '用户已存在',
      };
    }
    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码
    await this.userModel.create({
      username,
      password: hashPwd,
      salt,
      deleteFlag: 0,
      role: 3,
    });
    return {
      message: '新建成功',
    };
  }
  /**
   * @name:获取用户信息
   * @msg:
   * @param {*}
   * @return {*}
   */
  async userInfo(user: any): Promise<any> {
    return {
      // code: 200,
      data: user,
    };
  }
}
