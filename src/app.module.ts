/*
 * @Descripttion:
 * @version:
 * @Author: situ
 * @Date: 2021-10-24 16:59:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-15 00:57:38
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from 'libs/common/src';
import { UserModule } from './modules/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './modules//auth/auth.module';
import { LabelModule } from './modules/label/label.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { ArticleModule } from './modules/article/article.module';
import { FreeModule } from './modules/free/free.module';
import { FileModule } from './modules/file/file.module';
const MAO = require('multer-aliyun-oss');

@Module({
  imports: [
    CommonModule,
    //异步加载OSS配置
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: MAO({
            config: {
              region: process.env.OSS_REGION,
              accessKeyId: process.env.OSS_ACCESS_KEY_ID,
              accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
              bucket: process.env.OSS_BUCKET,
            },
          }),
        };
      },
    }),
    UserModule,
    AuthModule,
    LabelModule,
    ClassificationModule,
    ArticleModule,
    FreeModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
