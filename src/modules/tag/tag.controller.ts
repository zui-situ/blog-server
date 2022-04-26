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
import { TagService } from './tag.service';
import { createDto, editStatusDto, listDto } from './tag.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from 'libs/common/decorator/crud/crud.decorator';
import { Tag } from '@app/db/models/tag.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

//添加增删改查方法
@Crud({
  model: Tag,
  findKey: 'name',
  createDefaultValue: {
    status: 1,
    deleteFlag: 0,
  },
})
@Controller('tag')
@ApiTags('标签')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    @InjectModel(Tag) private model: ReturnModelType<typeof Tag>,
  ) {}

  @Post('editStatus/:id')
  @ApiOperation({ summary: '修改标签状态' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async editStatus(
    @Param('id') id: ObjectId,
    @Body() body: editStatusDto,
  ): Promise<any> {
    const { status } = body;
    await this.tagService.upDateTagStatus(id, status);
    return { message: '修改成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '标签列表' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async tagList(@Query() query: listDto): Promise<any> {
    const list = await this.tagService.tagList(query);
    const pagination = await this.tagService.tagPage(query);
    return {
      data: {
        list,
        pagination,
      },
    };
  }
}
