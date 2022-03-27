import { forwardRef, Module } from '@nestjs/common';
import { FreeController } from './free.controller';
import { FreeService } from './free.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [forwardRef(() => ArticleModule)],
  controllers: [FreeController],
  providers: [FreeService],
  exports: [FreeService],
})
export class FreeModule {}
