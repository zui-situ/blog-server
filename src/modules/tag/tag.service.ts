import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from '@app/db/models/tag.model';
import { ObjectId } from 'mongoose';
import { ArticleService } from '../article/article.service';

@Injectable()
export class TagService {
  constructor(
    private readonly articleService: ArticleService,
    @InjectModel(Tag) private tagModel: ReturnModelType<typeof Tag>,
  ) {}

  /**
   * 创建
   *
   * @param body 实体对象
   */
  async createTag(body: any): Promise<any> {
    const { name } = body;
    const data = await this.tagModel.findOne({ name });
    if (data) {
      if (data.deleteFlag === 1) {
        await this.tagModel.findByIdAndUpdate(data._id, { deleteFlag: 0 });
      } else {
        throw new HttpException({ message: `名字${name}的标签已存在` }, 404);
      }
    } else {
      await this.tagModel.create({
        ...body,
        status: 0,
        deleteFlag: 1,
      });
    }
  }
  /**
   * 删除
   *
   * @param id ID
   */
  async deleteTag(id: ObjectId): Promise<void> {
    await this.tagModel.findByIdAndUpdate(id, { deleteFlag: 1 });
  }
  /**
   * 更新
   *
   * @param id ID
   * @param body 内容
   */
  async updateTag(id: ObjectId, body: any): Promise<void> {
    const { name, icon } = body;
    await this.tagModel.findByIdAndUpdate(id, { name, icon });
  }
  /**
   * 查询
   *
   * @param id ID
   */
  async findTag(id: ObjectId): Promise<any> {
    return await this.tagModel.findById(id);
  }
  /**
   * 更新状态
   *
   * @param id ID
   * @param status 状态
   */
  async upDateTagStatus(id: ObjectId, status: number): Promise<void> {
    await this.tagModel.findByIdAndUpdate(id, { status });
  }
  /**
   * 查询标签列表
   *
   * @query query 内容
   */
  async tagList(query: any): Promise<any> {
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
    const data = await this.tagModel
      .find(findObj, '-deleteFlag', selectObj)
      .lean();
    for (const item of data) {
      const articleCount = await this.articleService.articleCountByTag(
        item._id,
      );
      item['articleCount'] = articleCount;
    }
    return data;
  }
  /**
   * 查询标签分页
   *
   * @query query 内容
   */
  async tagPage(query: any): Promise<any> {
    const { pageNo, pageSize } = query;
    const findObj = await this.ListFindObj(query);
    const count = await this.tagModel.countDocuments(findObj);
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
