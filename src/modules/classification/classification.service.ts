import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Classification } from '@app/db/models/classification.model';
import { ObjectId } from 'mongoose';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Classification)
    private classificationModel: ReturnModelType<typeof Classification>,
  ) {}

  /**
   * 创建
   *
   * @param body 实体对象
   */
  async createLabel(body: any): Promise<any> {
    const { name } = body;
    const data = await this.classificationModel.findOne({ name });
    if (data) {
      if (data.deleteFlag === 1) {
        await this.classificationModel.findByIdAndUpdate(data._id, {
          deleteFlag: 0,
        });
      } else {
        throw new HttpException({ message: `名称${name}的分类已存在` }, 404);
      }
    } else {
      await this.classificationModel.create({
        name,
        status: 0,
        deleteFlag: 0,
      });
    }
  }
  /**
   * 删除
   *
   * @param id ID
   */
  async deleteLabel(id: ObjectId): Promise<void> {
    await this.classificationModel.findByIdAndUpdate(id, { deleteFlag: 1 });
  }
  /**
   * 更新
   *
   * @param id ID
   * @param body 内容
   */
  async updateLabel(id: ObjectId, body: any): Promise<void> {
    const { name } = body;
    await this.classificationModel.findByIdAndUpdate(id, { name });
  }
  /**
   * 查询
   *
   * @param id ID
   */
  async findLabel(id: ObjectId): Promise<any> {
    return await this.classificationModel.findById(id);
  }
  /**
   * 更新状态
   *
   * @param id ID
   * @param status 状态
   */
  async upDateLabelStatus(id: ObjectId, status: number): Promise<void> {
    await this.classificationModel.findByIdAndUpdate(id, { status });
  }
  /**
   * 查询标签列表
   *
   * @query query 内容
   */
  async labelList(query: any): Promise<any> {
    const { pageNo, pageSize } = query;
    const skip = (pageNo - 1) * pageSize;
    const findObj = await this.ListFindObj(query);
    console.log(findObj);
    const data = await this.classificationModel
      .find(findObj, '-deleteFlag', {
        sort: '-createdAt',
        limit: pageSize * 1,
        skip,
      })
      .lean();
    return data;
  }
  /**
   * 查询标签总数
   *
   * @query query 内容
   */
  async labelCount(query: any): Promise<any> {
    const findObj = await this.ListFindObj(query);
    return this.classificationModel.countDocuments(findObj);
  }
  /**
   * 查询标签查询obj
   *
   * @query query 内容
   */
  ListFindObj(query) {
    const { status, name } = query;
    const reg = new RegExp(name, 'i'); //不区分大小写
    const findObj: any = {
      $or: [{ name: { $regex: reg } }],
      deleteFlag: 0,
    };
    if (Number(status) === 1 || Number(status) === 0) {
      findObj.status = Number(status);
    }
    return findObj;
  }
}