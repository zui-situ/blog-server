import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, DocumentType } from '@typegoose/typegoose';

export type CategoryDocument = DocumentType<Category>;

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Category {
  @ApiProperty({ description: '类别名称', example: '热门' })
  @prop()
  public name: string;

  @ApiProperty({ description: '类别标识', example: 'web' })
  @prop()
  public code: string;

  @ApiProperty({ description: '类别图标', example: 'html' })
  @prop()
  public icon: string;

  @ApiProperty({ description: '类别封面', example: '' })
  @prop()
  public cover: string;

  @ApiProperty({
    description: '[禁用标记]: 0-关闭 | 1-开启',
  })
  @prop()
  public status: number;

  @ApiProperty({
    description: '[删除标记]: 0-未删除 | 1-删除',
  })
  @prop()
  public deleteFlag: number;
}
