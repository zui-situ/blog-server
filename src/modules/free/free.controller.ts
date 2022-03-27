import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { listDto } from '../article/article.dto';
import { ArticleService } from '../article/article.service';

@Controller('free')
@ApiTags('免权')
export class FreeController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('list')
  @ApiOperation({ summary: '文章列表' })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async labelList(@Query() query: listDto): Promise<any> {
    const list = await this.articleService.articleList(query);
    const count = await this.articleService.articleCount(query);
    return {
      data: {
        list,
        count,
      },
    };
  }
}
