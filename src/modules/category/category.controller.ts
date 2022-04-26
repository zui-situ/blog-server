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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { createDto, editStatusDto, listDto } from './category.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from 'libs/common/decorator/crud/crud.decorator';
import { Category } from '@app/db/models/category.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

//添加增删改查方法
@Crud({
  model: Category,
  findKey: 'name',
  createDefaultValue: {
    status: 1,
    deleteFlag: 0,
  },
})
@Controller('category')
@ApiTags('分类')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectModel(Category)
    private model: ReturnModelType<typeof Category>,
  ) {}

  @Post('editStatus/:id')
  @ApiOperation({ summary: '修改分类状态' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async editStatus(
    @Param('id') id: ObjectId,
    @Body() body: editStatusDto,
  ): Promise<any> {
    const { status } = body;
    await this.categoryService.upDateCategoryStatus(id, status);
    return { message: '修改成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '分类列表' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async labelList(@Query() query: listDto): Promise<any> {
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
