import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Tag } from './tag.model';
import { Category } from './category.model';

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
  public user: Ref<User>;

  @ApiProperty({ description: '类别' })
  @prop({ ref: 'Category' })
  public category: Ref<Category>;

  @ApiProperty({ description: '标签' })
  @prop({ ref: 'Tag' })
  public tag: Ref<Tag>[]; // This is a Reference Array

  @ApiProperty({ description: '标题', example: 'title' })
  @prop()
  public title: string;

  @ApiProperty({ description: '描述', example: '描述描述描述' })
  @prop()
  public description: string;

  @ApiProperty({ description: '封面', example: '' })
  @prop()
  public cover: string;

  @ApiProperty({ description: '内容', example: 'content' })
  @prop()
  public content: string;

  @ApiProperty({ description: '浏览数' })
  @prop()
  public readNum?: number;

  @ApiProperty({
    description: '[发布标记]: 0-未发布 | 1-发布',
  })
  @prop()
  public status: number;

  @ApiProperty({
    description: '[删除标记]: 0-未删除 | 1-删除',
  })
  @prop()
  public deleteFlag: number;
}
