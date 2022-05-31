import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { listDto } from '../article/article.dto';
import { ArticleService } from '../article/article.service';
import { TagService } from '../tag/tag.service';
import { listDto as tagListDto } from '../tag/tag.dto';
import { listDto as categoryListDto } from '../category/category.dto';
import { CategoryService } from '../category/category.service';

@Controller('free')
@ApiTags('免权')
export class FreeController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('article/list')
  @ApiOperation({ summary: '文章列表' })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async articleList(@Query() query: listDto): Promise<any> {
    const list = await this.articleService.articleList(query);
    const pagination = await this.articleService.articlePage(query);
    return {
      data: {
        list,
        pagination,
      },
    };
  }

  /**
   * 查询
   *
   * @param id ID
   */
  @Get('article/:id')
  @ApiOperation({ summary: 'find a record' })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async find(@Param('id') id: ObjectId): Promise<any> {
    const data = await this.articleService.find(id);
    return {
      data,
    };
  }

  /**
   * 查询
   *
   * @param id ID
   */
  @Get('tag/list')
  @ApiOperation({ summary: '标签列表' })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async tagList(@Query() query: tagListDto): Promise<any> {
    const list = await this.tagService.tagList(query);
    const pagination = await this.tagService.tagPage(query);
    return {
      data: {
        list,
        pagination,
      },
    };
  }

  /**
   * 查询分类列表
   *
   * @param id ID
   */
  @Get('category/list')
  @ApiOperation({ summary: '标签列表' })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async categoryList(@Query() query: categoryListDto): Promise<any> {
    const list = await this.categoryService.categoryList(query);
    const pagination = await this.categoryService.categoryPage(query);
    return {
      data: {
        list,
        pagination,
      },
    };
  }
}
