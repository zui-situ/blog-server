import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { hashSync } from 'bcryptjs';

export type UserDocument = DocumentType<User>

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
  schemaOptions:{
    timestamps:true
  }
})

export class User {
    @ApiProperty({ description:'用户名', example:'username',required: false })
    @prop({required: false})
    username: string;

    @ApiProperty({ description:'用户头像'})
    @prop()
    avatarUrl?: string;

    @ApiProperty({ description:'密码',required: false})
    @prop({
      required: false,
      select: false,  //表示常规请求不展示这个值
      get(val){
        return val
      },
      set(val){//表示返回改造后的新值保存到数据库
        return val ? hashSync(val) :val
      }
    })
    password?: string;

    @ApiProperty({ description:'个性签名' })
    @prop()
    utograph?: string;

    @ApiProperty({ description:'超级管理权限，0是正常用户，1是超级管理员用户'})
    @prop()
    jurisdiction: number

    @ApiProperty({ description:'删除标记,0是未删除，1是删除'})
    @prop()
    deleteFlag: number
}