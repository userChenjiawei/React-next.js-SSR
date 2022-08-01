import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { User } from '../../../db/entity/index';
import { EXCEPRION_USER } from '../config/codes';
export default withIronSessionApiRoute(update, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

async function update(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const { nickname, job, introduce } = req.body;
  const session: ISession = req.session; //由于withIronSessionApiRoute 因此在这里的req存在session对象  为session对象定义了类型ISession
  const { userId } = session;
  const userRepo = AppDataSource.getRepository(User); //应该是定义一个需要操作的数据库对象
  const userInfo = await userRepo.findOne({
    where: {
      id: userId,
    },
  });
  if (userInfo) {
    userInfo.nickname = nickname;
    userInfo.job = job;
    userInfo.introduce = introduce;
    const resUser = await userRepo.save(userInfo);
    res.status(200).json({
      code: 0,
      data: resUser,
    });
  } else {
    res.status(200).json({ ...EXCEPRION_USER.NOT_FOUND });
  }
}
