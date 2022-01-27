/*
 * @Descripttion:
 * @version:
 * @Author: situ
 * @Date: 2021-11-03 00:44:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-15 09:07:21
 */
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'libs/common/strategy/local.strategy';
import { JwtStrategy } from 'libs/common/strategy/jwt.strategy';
import { UserModule } from '../user/user.module';

//
@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
