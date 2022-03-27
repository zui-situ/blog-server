/*
 * @Descripttion:
 * @version:
 * @Author: situ
 * @Date: 2021-10-24 23:11:18
 * @LastEditors:
 * @LastEditTime: 2021-11-14 21:54:35
 */
import { Module, Global, CacheModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { OssService } from '../oss/oss.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@app/db';
import { JwtModule } from '@nestjs/jwt';

//标记为全局引用模块
@Global()
@Module({
  imports: [
    //设置配置项
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory() {
        return {
          ttl: 5, //秒
          max: 10, //缓存中最大和最小数量
        };
      },
    }),
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env.SECRET,
        };
      },
    }),
    DbModule,
  ],
  providers: [CommonService, OssService],
  exports: [CommonService, JwtModule, OssService],
})
export class CommonModule {}
