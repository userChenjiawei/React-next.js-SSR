import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { Tag } from '../../../db/entity/index';
export default withIronSessionApiRoute(get, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

async function get(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const session: ISession = req.session;

  const TagRepo = await AppDataSource.getRepository(Tag); //应该是定义一个需要操作的数据库对象
  const followTags = await TagRepo.find({
    relations: ['users'],
    where: { users: session.userId }, //这个find查询 很有意思
  }); //这里如果时find，那么返回的是一个数组 ，若要返回一个，则使用findone
  const allTags = await TagRepo.find({
    relations: ['users'],
  });
  res.status(200).json({
    code: 0,
    msg: '',
    data: {
      followTags,
      allTags,
    },
  });
}
