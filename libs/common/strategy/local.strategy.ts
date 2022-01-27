/*
 * @Descripttion:本地策略
 * @version:
 * @Author: situ
 * @Date: 2021-10-25 01:13:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-09 00:09:27
 */
import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '@app/db/models/user.model';
import { BadRequestException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { encryptPassword } from '../../../src/utils/cryptogram';

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @InjectModel(User) private userModel: ReturnModelType<typeof User>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  async validate(username: string, password: string): Promise<any> {
    const user = await this.userModel
      .findOne({ username })
      .select('+password +salt');
    if (user) {
      const hashedPassword = user.password;
      const salt = user.salt;
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return user;
      } else {
        // 密码错误
        throw new BadRequestException('密码不正确');
      }
    }
    throw new BadRequestException('查无此人');
  }
}
