import { Article } from '@app/db/models/article.model';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { Crud } from 'libs/common/decorator/crud/crud.decorator';
import { ObjectId } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { editStatusDto, listDto } from './article.dto';
import { ArticleService } from './article.service';

//添加增删改查方法
@Crud({
  model: Article,
  createDefaultValue: {
    readNum: 0,
    status: 0,
    deleteFlag: 0,
  },
  addUser: true,
})
@Controller('article')
@ApiTags('文章')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    @InjectModel(Article)
    private model: ReturnModelType<typeof Article>,
  ) {}

  @Get('list')
  @ApiOperation({ summary: '文章列表' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
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

  @Post('editStatus/:id')
  @ApiOperation({ summary: '修改文章状态' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async editStatus(
    @Param('id') id: ObjectId,
    @Body() body: editStatusDto,
  ): Promise<any> {
    const { status } = body;
    await this.articleService.upDateArticleStatus(id, status);
    return { message: '修改成功' };
  }
}
