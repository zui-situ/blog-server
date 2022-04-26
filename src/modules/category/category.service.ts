import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Category } from '@app/db/models/category.model';
import { ObjectId } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: ReturnModelType<typeof Category>,
  ) {}

  /**
   * 创建
   *
   * @param body 实体对象
   */
  async createCategory(body: any): Promise<any> {
    const { name } = body;
    const data = await this.categoryModel.findOne({ name });
    if (data) {
      if (data.deleteFlag === 1) {
        await this.categoryModel.findByIdAndUpdate(data._id, {
          deleteFlag: 0,
        });
      } else {
        throw new HttpException({ message: `名称${name}的分类已存在` }, 404);
      }
    } else {
      await this.categoryModel.create({
        name,
        status: 0,
        deleteFlag: 0,
      });
    }
  }
  /**
   * 更新状态
   *
   * @param id ID
   * @param status 状态
   */
  async upDateCategoryStatus(id: ObjectId, status: number): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(id, { status });
  }
  /**
   * 查询分类列表
   *
   * @query query 内容
   */
  async categoryList(query: any): Promise<any> {
    const { pageNo, pageSize } = query;
    const skip = (pageNo - 1) * pageSize;
    const findObj = await this.ListFindObj(query);
    const selectObj = {
      sort: '-createdAt',
    };
    if (pageNo && pageSize) {
      Object.assign(selectObj, {
        limit: pageSize * 1,
        skip,
      });
    }
    const data = await this.categoryModel
      .find(findObj, '-deleteFlag', selectObj)
      .lean();
    return data;
  }
  /**
   * 查询标签总数
   *
   * @query query 内容
   */
  async categoryPage(query: any): Promise<any> {
    const { pageNo, pageSize } = query;
    const findObj = await this.ListFindObj(query);
    const count = await this.categoryModel.countDocuments(findObj);
    return {
      count,
      currentPage: Number(pageNo),
      limit: Number(pageSize),
      total: Math.ceil(count / pageSize),
    };
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
