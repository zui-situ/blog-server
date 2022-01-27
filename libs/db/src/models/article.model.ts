import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Label } from './label.model';
import { Classification } from './classification.model';

export type ArticleDocument = DocumentType<Article>;

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Article {
  @ApiProperty({ description: '用户信息' })
  @prop({ ref: 'User' })
  user: Ref<User>;

  @ApiProperty({ description: '分类' })
  @prop({ ref: 'Classification' })
  classification: Ref<Classification>;

  @ApiProperty({ description: '标签' })
  @prop({ ref: 'Label' })
  label: Ref<Label>;

  @ApiProperty({ description: '标题', example: 'title' })
  @prop()
  title: string;

  @ApiProperty({ description: '内容', example: 'content' })
  @prop()
  content: string;

  @ApiProperty({ description: '浏览数' })
  @prop()
  readNum?: number;

  @ApiProperty({
    description: '[删除标记]: 0-未删除 | 1-删除',
  })
  @prop()
  deleteFlag: number;
}
