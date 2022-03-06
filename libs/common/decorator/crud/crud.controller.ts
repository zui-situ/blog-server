import { UserDocument } from '@app/db/models/user.model';
import {
  Body,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Model, ObjectId } from 'mongoose';
import { CurrentUser } from '../current.user.decorator';

export class CrudPlaceholderDto {
  fake?: string;
  [key: string]: any;
}

export class CrudController {
  constructor(public model: Model<any>, public crudOptions?: any) {}

  /**
   * 创建
   *
   * @param body 实体对象
   */
  @Post('create')
  @ApiOperation({ summary: 'Create a record' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async create(
    @Body() body: CrudPlaceholderDto,
    @CurrentUser() user: UserDocument,
  ) {
    const { findKey, createDefaultValue, addUser = false } = this.crudOptions;
    console.log(createDefaultValue);
    if (findKey) {
      const value = body[findKey];
      const obj = {
        [findKey]: value,
      };
      const data = await this.model.findOne(obj);
      if (data) {
        if (data.deleteFlag === 1) {
          await this.model.findByIdAndUpdate(data._id, {
            deleteFlag: 0,
          });
        } else {
          throw new HttpException({ message: `${value}的已存在` }, 404);
        }
      } else {
        const createObj = {
          ...body,
          ...createDefaultValue,
        };
        if (addUser) {
          Object.assign(createObj, { user: user._id });
        }
        await this.model.create(createObj);
      }
    } else {
      const createObj = {
        ...body,
        ...createDefaultValue,
      };
      if (addUser) {
        Object.assign(createObj, { user: user._id });
      }
      await this.model.create(createObj);
    }

    return { message: '新建成功' };
  }

  /**
   * 删除
   *
   * @param id ID
   */
  @Post('remove/:id')
  @ApiOperation({ summary: 'delete a record' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async remove(@Param('id') id: ObjectId): Promise<any> {
    await this.model.findByIdAndUpdate(id, { deleteFlag: 1 });
    return { message: '删除成功' };
  }

  /**
   * 查询
   *
   * @param id ID
   */
  @Get('find/:id')
  @ApiOperation({ summary: 'find a record' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async find(@Param('id') id: ObjectId): Promise<any> {
    const data = await this.model.findById(id);
    return {
      data,
    };
  }

  /**
   * 修改
   *
   * @param id ID
   * @param body
   */
  @Post('update/:id')
  @ApiOperation({ summary: 'update a record' })
  @ApiBearerAuth() //标签这个接口需要传递token
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  async update(
    @Param('id') id: ObjectId,
    @Body() body: CrudPlaceholderDto,
  ): Promise<any> {
    await this.model.findByIdAndUpdate(id, body);
    return { message: '修改成功' };
  }
}
