import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { Tag, User } from '../../../db/entity/index';
import { EXCEPRION_USER, EXCEPRION_TAG } from 'pages/api/config/codes';
export default withIronSessionApiRoute(follow, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

async function follow(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const session: ISession = req.session;
  const { type, tagId } = req.body;
  const TagRepo = await AppDataSource.getRepository(Tag); //应该是定义一个需要操作的数据库对象
  const UserRepo = await AppDataSource.getRepository(User); //应该是定义一个需要操作的数据库对象
  const user = await UserRepo.findOne({
    where: {
      id: session.userId,
    },
  });
  const tag = await TagRepo.findOne({
    where: {
      id: tagId,
    },
    relations: ['users'],
  }); //这里如果时find，那么返回的是一个数组 ，若要返回一个，则使用findone

  if (!user) {
    res.status(200).json({
      ...EXCEPRION_USER.NOT_LOGIN,
    });
    return;
  }

  if (tag?.users) {
    if (type == 'follow') {
      tag.users = tag.users.concat([user]);
      tag.follow_count = tag.follow_count + 1;
    } else if (type == 'unFollow') {
      tag.users = tag.users.filter((user) => user.id !== session.userId);
      tag.follow_count = tag.follow_count - 1;
    }
  }

  if (tag) {
    const resTag = await TagRepo.save(tag);
    res.status(200).json({
      code: 0,
      msg: '',
      data: resTag,
    });
  } else {
    res.status(200).json({
      ...EXCEPRION_TAG.FOLLOW_FAILED,
    });
  }
}
