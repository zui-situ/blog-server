import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [ArticleModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
