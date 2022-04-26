import { Article } from '@app/db/models/article.model';
import { Injectable } from '@nestjs/common';
import { mongoose, ReturnModelType } from '@typegoose/typegoose';
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
      .populate('tag', 'name')
      .populate('category', 'name')
      .lean();
    return data;
  }
  /**
   * 查询文章总数
   *
   * @query query 内容
   */
  async articlePage(query: any): Promise<any> {
    const { pageNo, pageSize } = query;
    const findObj = await this.articleFindObj(query);
    const count = await this.articleModel.countDocuments(findObj);
    return {
      count,
      currentPage: Number(pageNo),
      limit: Number(pageSize),
      total: Math.ceil(count / pageSize),
    };
  }
  /**
   * 文章查询obj
   *
   * @query query 内容
   */
  articleFindObj(query) {
    const { status, category, tag, keyword } = query;
    const reg = new RegExp(keyword, 'i'); //不区分大小写
    // const ObjectId = require('mongodb').ObjectId;
    const orObj = [{ title: { $regex: reg } }, { content: { $regex: reg } }];
    const findObj: any = {
      $or: orObj,
      deleteFlag: 0,
    };
    if (Number(status) === 1 || Number(status) === 0) {
      findObj.status = Number(status);
    }
    if (category) findObj.category = new ObjectId(category);
    if (tag) findObj.tag = new ObjectId(tag);
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

  /**
   * 查询
   *
   * @param id ID
   */
  async find(id: _ObjectId): Promise<any> {
    const data = await this.articleModel.findOneAndUpdate(
      { _id: id },
      { $inc: { readNum: 1 } },
    );
    return data;
  }

  /**
   * 查询单一标签的文章数量
   *
   * @param tag ID
   */
  async articleCountByTag(tag: mongoose.Types.ObjectId): Promise<any> {
    const data = await this.articleModel
      .find({
        tag: {
          $elemMatch: { $eq: tag },
        },
      })
      .count();
    return data;
  }
}
