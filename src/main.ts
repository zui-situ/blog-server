import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'libs/common/filter/http-exception.filter';
import { AllExceptionsFilter } from 'libs/common/filter/any-exception.filter';
import { TransformInterceptor } from 'libs/common/interceptor/transform.interceptor';
import { logger } from 'libs/common/middleware/logger.middleware';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // 监听所有的请求路由，并打印日志
  app.use(logger);

  //允许跨域
  app.enableCors();

  // 使用拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  // // 全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('博客后端接口文档')
    .setDescription('博客后端接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.PORT;
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`);
}
bootstrap();
