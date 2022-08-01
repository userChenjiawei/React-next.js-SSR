import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { User, UserAuth } from '../../../db/entity/index';
export default withIronSessionApiRoute(login, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。

import { Cookie } from 'next-cookie'; //使用next.js在客户端和服务器上获取 cookie 的微小功能。
// 这使得依赖于 cookie 的页面的客户端和服务器端呈现变得容易。
import { setCookie } from 'utils'; //设置cookie 自己封装的函数

async function login(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const cookies = Cookie.fromApiRoute(req, res); //只需传入请求和响应对象即可读取和写入 cookie
  const { phone, verify, identity_type } = req.body; //从登陆页面的登陆请求的请求体中取出相应数据
  const session: ISession = req.session; //由于withIronSessionApiRoute 因此在这里的req存在session对象  为session对象定义了类型ISession
  const userAuthRepo = AppDataSource.getRepository(UserAuth); //应该是定义一个需要操作的数据库对象
  console.log('1111', session.verifyCode, verify);

  if (String(session.verifyCode) === String(verify)) {
    //验证码正确 在user_auth中查找
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type: identity_type,
        identifier: phone,
      },
      relations: ['user'],
    }); //寻找电话类型以及该电话号码的一组
    // eslint-disable-next-line no-empty
    //如果存在该用户
    console.log('1111-', userAuth);

    if (userAuth) {
      const user = userAuth.user; // 应为有一对多 因此userAuth中存在user表
      const { id, nickname, avatar } = user;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar; //给服务端的session添加值
      await session.save(); //保存
      setCookie(cookies, { id, nickname, avatar });
      //自己封装函数  给cookies赋值 这里的cookies是指const cookies = Cookie.fromApiRoute(req, res);
      res.status(200).json({
        code: 0,
        msg: '登陆成功',
        data: {
          userId: id,
          nickname: nickname,
          avatar: avatar,
        },
      });
    } else {
      //在auth_User中不存在 因此需要创建新用户
      const user = new User();
      user.nickname = `用户${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.webp';
      user.job = 'no';
      user.introduce = 'no';
      const userAuth1 = new UserAuth();
      userAuth1.identifier = phone;
      userAuth1.identity_type = identity_type;
      userAuth1.credential = session.verifyCode;
      userAuth1.user = user;
      console.log('2222');

      await userAuthRepo.save(userAuth1);
      const {
        user: { id, nickname, avatar },
      } = userAuth1;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { id, nickname, avatar });
      res.status(200).json({
        code: 0,
        msg: '登陆成功',
        data: {
          UserId: id,
          nickname: nickname,
          avatar: avatar,
        },
      });
    }
  } else {
    res.status(200).json({
      code: -1,
      msg: '登陆失败',
    });
  }
}
