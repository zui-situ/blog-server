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
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { LabelService } from './label.service';
import { createDto, editStatusDto, listDto } from './label.dto';
import { RCode } from '../../utils/rcode';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('label')
@ApiTags('标签')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post('create')
  @ApiOperation({ summary: '新增标签' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async create(@Body() body: createDto): Promise<any> {
    await this.labelService.createLabel(body);
    return { message: '新建成功' };
  }

  @Post('remove/:id')
  @ApiOperation({ summary: '删除标签' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async remove(@Param('id') id: ObjectId): Promise<any> {
    console.log(id, 'id');
    await this.labelService.deleteLabel(id);
    return { message: '删除成功' };
  }

  @Get('find/:id')
  @ApiOperation({ summary: '查询标签' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async register(@Param('id') id: ObjectId): Promise<any> {
    const data = await this.labelService.findLabel(id);
    return {
      data,
    };
  }

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
    await this.labelService.upDateLabelStatus(id, status);
    return { message: '修改成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '标签列表' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async labelList(@Query() query: listDto): Promise<any> {
    const list = await this.labelService.labelList(query);
    const count = await this.labelService.labelCount(query);
    return {
      data: {
        list,
        count,
      },
    };
  }
}
