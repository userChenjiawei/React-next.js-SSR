import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';

import { Article, Tag } from '../../../db/entity/index';
import { EXCEPRION_ARTICLE } from '../config/codes';
export default withIronSessionApiRoute(update, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

async function update(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));

  const { title, content, id, tagtitles } = req.body;

  const ArticleRepo = await AppDataSource.getRepository(Article); //应该是定义一个需要操作的数据库对象
  const TagRepo = await AppDataSource.getRepository(Tag); //应该是定义一个需要操作的数据库对象
  const tags = await TagRepo.find({
    where: tagtitles?.map((tagtitle: number) => ({ title: tagtitle })),
  });

  const article = await ArticleRepo.findOne({
    where: {
      id,
    },
    relations: ['user'],
  });
  if (tags) {
    tags.forEach((tag) => {
      tag.article_count = tag.article_count + 1;
      return tag;
    });
  }
  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();
    article.tags = tags;
    const resArticle = await ArticleRepo.save(article);
    if (resArticle) {
      res.status(200).json({ data: resArticle, code: 0, msg: '更新成功' });
    } else {
      res.status(200).json({ ...EXCEPRION_ARTICLE.UPDATE_FAILED });
    }
  } else {
    res.status(200).json({ ...EXCEPRION_ARTICLE.NOT_FOUND });
  }
}
