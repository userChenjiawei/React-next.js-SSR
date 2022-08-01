import { NextApiRequest, NextApiResponse } from 'next'; //req和res的类型申明
import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next'; //包装Next.js API 路由并将session对象添加到请求中。
// import request from 'services/fetch';
import AppDataSource from 'db/index';
import { ISession } from 'pages/api'; //定义session类型
import { User, UserAuth } from '../../../db/entity/index';
import request from 'services/fetch';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';
export default withIronSessionApiRoute(redirect, ironOptions); //包装Next.js API 路由并将session对象添加到请求中。


async function redirect(req: NextApiRequest, res: NextApiResponse) {
    const session:ISession = req.session
     const {code} = req.query
     console.log(code,'9999sidasdia');
     const githubClientId = 'fa85641c7c1a32b9d85c';
     const githubSecret = 'c6b0b5b7ea620550543e5772443f17c7e023e1bf'
     const url = 'https://github.com/login/oauth/access_token?'+`client_id=${githubClientId}&`+`client_secret=${githubSecret}&`+`code=${code}`
     const result = await request.post(url,{},
        {
            headers: {
                accept: 'application/json'
              }
        }
        )
        //这个请求失败了  哪里错误了呢？？
     console.log('1111');
     
     console.log(result,'result');
     
     const {access_token} = result as any
     console.log('2222');
     console.log(access_token,'access_token');

     const githubUserInfo = await request.get('https://api.github.com/user',{
        headers: {
            accept: 'application/json',
            Authorization: `token ${access_token}`
          }
     })
     console.log('3333');
     console.log(githubUserInfo,'githubUserInfo');
    await AppDataSource.initialize()  
     .then(async () => {
       //   前两次必定失败 不知道为什么
     }) //似乎是数据库的初始化
     .catch((error) => console.log(error));
     const cookies = Cookie.fromApiRoute(req,res)
     const userAuth = await AppDataSource.getRepository(UserAuth).findOne({
        where:{
            identity_type : 'github',
        identifier : githubClientId
        },relations:['user']
     })
     if(userAuth){
        const user = userAuth.user
        const {id,nickname,avatar} = user
        userAuth.credential = access_token
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;
        await session.save()
        setCookie(cookies,{id,nickname,avatar})
        console.log('ok1');
        
        res.writeHead(302,{
            Location:'http://localhost:3000'
        })
        console.log('ok2');
        
     }else{
        //在auth_User中不存在 因此需要创建新用户
        const {login='',avatar_url=''} = githubUserInfo as any
      const user = new User();
        user.nickname = login;
        user.avatar = avatar_url;
        user.job = ''
        user.introduce = ''
        const userAuthbiao = new UserAuth()
        userAuthbiao.credential = access_token;
        userAuthbiao.identity_type = 'github';
        userAuthbiao.identifier = githubClientId;
        userAuthbiao.user = user;
        const userAuthRepo = AppDataSource.getRepository(UserAuth)
        const resUserAuth = await userAuthRepo.save(userAuthbiao)
        const {id,nickname,avatar} = resUserAuth.user;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar; 
        await session.save()
        setCookie(cookies,{id,nickname,avatar})
        res.writeHead(302,{
            Location:'/'
        })
        // res.status(200).json({
        //     code:0,
        //     msg:'登陆成功',
        //     data:{
        //         userId:id,
        //         nickname,avatar
        //     }
        // })
     }
      
}
