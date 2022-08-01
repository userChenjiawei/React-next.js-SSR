import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { Article, User, Tag } from '../../../db/entity/index';
import { EXCEPRION_ARTICLE } from '../config/codes';
export default withIronSessionApiRoute(publish, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

async function publish(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const session: ISession = req.session;
  const { title, content, tagIds } = req.body;

  const UserRepo = await AppDataSource.getRepository(User); //应该是定义一个需要操作的数据库对象
  const ArticleRepo = await AppDataSource.getRepository(Article); //应该是定义一个需要操作的数据库对象
  const TagRepo = await AppDataSource.getRepository(Tag); //应该是定义一个需要操作的数据库对象
  const tags = await TagRepo.find({
    where: tagIds?.map((tagid: number) => ({ id: tagid })),
  });
  const user = await UserRepo.find({
    where: {
      id: session.userId,
    },
  }); //这里如果时find，那么返回的是一个数组 ，若要返回一个，则使用findone
  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user[0];
  }
  if (tags) {
    const newTags = tags.map((tag) => {
      tag.article_count = tag.article_count + 1;
      return tag;
    });
    article.tags = newTags;
  }
  const resArticle = await ArticleRepo.save(article);
  console.log('resArticle', resArticle);

  if (resArticle) {
    res.status(200).json({ data: resArticle, code: 0, msg: '发布成功' });
  } else {
    res.status(200).json({ ...EXCEPRION_ARTICLE.PUBLIC_FAILED });
  }
}
