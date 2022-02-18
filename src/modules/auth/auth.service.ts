import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { encryptPassword } from '../../utils/cryptogram';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(username: string, password: string): Promise<any> {
    // console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.userService.findOneByUserName(username);
    if (user) {
      const hashedPassword = user.password;
      const salt = user.salt;
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 1,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null,
        };
      }
    }
    // 查无此人
    return {
      code: 3,
      user: null,
    };
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: any) {
    // console.log('JWT验证 - Step 3: 处理 jwt 签证', `payload: ${JSON.stringify(payload)}`);
    const token = this.jwtService.sign(String(user._id));
    try {
      // const token = this.jwtService.sign(user._id);
      return {
        // code: 200,
        data: {
          token,
        },
        message: `登录成功`,
      };
    } catch (error) {
      return {
        code: 500,
        message: `账号或密码错误`,
      };
    }
  }
}
