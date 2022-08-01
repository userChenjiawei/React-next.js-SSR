import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
export default withIronSessionApiRoute(logout, ironOptions); //session  会保存在cookie中
import { ISession } from 'pages/api'; //定义session类型
import { Cookie } from 'next-cookie';
import { clearCookie } from 'utils';
async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  await session.destroy();
  clearCookie(cookies);
  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  });
}
