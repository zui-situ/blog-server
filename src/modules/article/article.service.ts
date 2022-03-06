import { Article } from '@app/db/models/article.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ObjectId as _ObjectId } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private articleModel: ReturnModelType<typeof Article>,
  ) {}

  /**
   * 查询文章列表
   *
   * @query query 内容
   */
  async articleList(query: any): Promise<any> {
    const { pageNo, pageSize } = query;
    const skip = (pageNo - 1) * pageSize;
    const findObj = await this.articleFindObj(query);
    const data = await this.articleModel
      .find(findObj, '-deleteFlag', {
        sort: '-createdAt',
        limit: pageSize * 1,
        skip,
      })
      .populate('label', 'name')
      .populate('classification', 'name')
      .lean();
    return data;
  }
  /**
   * 查询文章总数
   *
   * @query query 内容
   */
  async articleCount(query: any): Promise<any> {
    const findObj = await this.articleFindObj(query);
    return this.articleModel.countDocuments(findObj);
  }
  /**
   * 文章查询obj
   *
   * @query query 内容
   */
  articleFindObj(query) {
    const { status, title, classification } = query;
    const reg = new RegExp(title, 'i'); //不区分大小写
    // const ObjectId = require('mongodb').ObjectId;
    const orObj = { title: { $regex: reg } };
    if (classification) {
      Object.assign(orObj, { classification: new ObjectId(classification) });
    }
    const findObj: any = {
      $or: [orObj],
      deleteFlag: 0,
    };
    console.log(findObj);
    if (Number(status) === 1 || Number(status) === 0) {
      findObj.status = Number(status);
    }
    return findObj;
  }

  /**
   * 更新状态
   *
   * @param id ID
   * @body status 状态
   */
  async upDateArticleStatus(id: _ObjectId, status: number): Promise<void> {
    await this.articleModel.findByIdAndUpdate(id, { status });
  }
}
