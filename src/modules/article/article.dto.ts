import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class listDto {
  @ApiProperty({
    description: '[禁用标记]: 0-关闭 | 1-开启',
    example: 0,
    type: Number,
    required: false,
  })
  readonly status: number;

  @ApiProperty({
    description: '标签ID',
    type: String,
    required: false,
  })
  readonly tag: string;

  @ApiProperty({
    description: '分类ID',
    type: String,
    required: false,
  })
  readonly category: string;

  // @ApiProperty({
  //   description: '标题',
  //   type: String,
  //   required: false,
  // })
  // readonly title: string;

  @ApiProperty({
    description: '关键字',
    type: String,
    required: false,
  })
  readonly keyword: string;

  @ApiProperty({
    description: '当前页数',
    type: Number,
  })
  @IsNotEmpty({ message: 'pageNo不能为空' })
  readonly pageNo: number;

  @ApiProperty({
    description: '单页数量',
    type: Number,
  })
  @IsNotEmpty({ message: 'pageSize不能为空' })
  readonly pageSize: number;
}

export class editStatusDto {
  @ApiProperty({
    description: '[发布标记]: 0-未发布 | 1-已发布',
    enum: [0, 1],
    example: 0,
    type: Number,
  })
  @IsNotEmpty({ message: '发布状态不能为空' })
  readonly status: number;
}
