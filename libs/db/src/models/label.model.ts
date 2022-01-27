import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, DocumentType } from '@typegoose/typegoose';

export type LabelDocument = DocumentType<Label>;

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Label {
  @ApiProperty({ description: '标签名称', example: '热门' })
  @prop()
  name: string;

  @ApiProperty({
    description: '[禁用标记]: 0-关闭 | 1-开启',
  })
  @prop()
  status: number;

  @ApiProperty({
    description: '[删除标记]: 0-未删除 | 1-删除',
  })
  @prop()
  deleteFlag: number;
}
