import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { Article, User, Comment } from '../../../db/entity/index';
import { EXCEPRION_COMMENT } from '../config/codes';
export default withIronSessionApiRoute(publish, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

async function publish(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const session: ISession = req.session;
  const { articleId, content } = req.body;

  const UserRepo = await AppDataSource.getRepository(User); //应该是定义一个需要操作的数据库对象
  const ArticleRepo = await AppDataSource.getRepository(Article); //应该是定义一个需要操作的数据库对象
  const CommentRepo = await AppDataSource.getRepository(Comment); //应该是定义一个需要操作的数据库对象

  const comment = new Comment();

  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();
  const user = await UserRepo.findOne({
    where: {
      id: session.userId,
    },
  }); //这里如果时find，那么返回的是一个数组 ，若要返回一个，则使用findone
  const article = await ArticleRepo.findOne({
    where: {
      id: articleId,
    },
  });
  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }
  const resComment = await CommentRepo.save(comment);
  console.log('resComment', resComment);

  if (resComment) {
    res.status(200).json({ data: resComment, code: 0, msg: '发布成功' });
  } else {
    res.status(200).json({ ...EXCEPRION_COMMENT.PUBLIC_FAILED });
  }
}
