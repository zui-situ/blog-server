import { Module } from '@nestjs/common';
import { FreeController } from './free.controller';
import { FreeService } from './free.service';
import { ArticleModule } from '../article/article.module';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ArticleModule, TagModule, CategoryModule],
  controllers: [FreeController],
  providers: [FreeService],
  exports: [FreeService],
})
export class FreeModule {}
