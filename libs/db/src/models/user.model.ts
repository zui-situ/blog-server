/*
 * @Descripttion:
 * @version:
 * @Author: situ
 * @Date: 2021-10-25 00:31:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-22 01:33:42
 */
import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, DocumentType } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';

export type UserDocument = DocumentType<User>;

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @ApiProperty({ description: '用户名', example: 'username', required: false })
  @prop({ required: false })
  username: string;

  @ApiProperty({ description: '用户头像' })
  @prop()
  avatarUrl?: string;

  @ApiProperty({ description: '密码', required: false })
  @prop({
    required: false,
    select: false, //表示常规请求不展示这个值
    // get(val) {
    //   return val;
    // },
    // set(val) {
    //   //表示返回改造后的新值保存到数据库
    //   return val ? hashSync(val) : val;
    // },
  })
  password?: string;

  @ApiProperty({ description: '邮箱地址' })
  @prop()
  email?: string;

  @ApiProperty({ description: '手机号码' })
  @prop()
  phone?: string;

  @ApiProperty({ description: '个性签名' })
  @prop()
  utograph?: string;

  @ApiProperty({
    description:
      '[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户（只能查看）',
  })
  @prop()
  role?: number | string;

  @ApiProperty({ description: '删除标记,0是未删除，1是删除' })
  @prop()
  deleteFlag: number;

  @ApiProperty({ description: '密码盐' })
  @prop({
    required: false,
    select: false, //表示常规请求不展示这个值
  })
  salt: string;
}
