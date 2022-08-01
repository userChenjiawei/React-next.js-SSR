import { format } from 'date-fns'; //调整时间格式
import { NextApiRequest, NextApiResponse } from 'next';  //req和res的类型申明
import { withIronSessionApiRoute } from 'iron-session/next';  
import md5 from 'md5';
import { encode } from 'js-base64'; //base64编码
import request from 'services/fetch';
import { ironOptions } from 'config';
import { ISession } from 'pages/api'; //定义session类型
export default withIronSessionApiRoute(sendVerifyCode, ironOptions); //session  会保存在cookie中
async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const { to, templateId } = req.body;   //获取请求提参数 to为电话号码 templateId为测试模板 值为1 
  const session:ISession = req.session;  //获取session的值
  const AppId = '8aaf070881ad8ad40182299427222112';
  const AccountId = '8aaf070881ad8ad401822994262e210b';
  const AuthToken = '9a052f2b6cde4db5b681922ea09b75e3';  //以上3个容联云中复制
  const NowDate = format(new Date(), 'yyyyMMddHHmmss'); //时间戳
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);  //url中需要的参数
  // REST API 验证参数，生成规则如下1.使用MD5加密（账户Id + 账户授权令牌 + 时间戳）。
  // 其中账户Id和账户授权令牌根据url的验证级别对应主账户。时间戳是当前系统时间，格式"yyyyMMddHHmmss"。
  // 时间戳有效时间为24小时，如：201404161420302.SigParameter参数需要大写，如不能写成sig=abcdefg而应该写成sig=ABCDEFG
  const Authorization = encode(`${AccountId}:${NowDate}`);  //相当于token  需要使用base64编码
  // 验证信息，生成规则详见下方说明1.使用Base64编码（账户Id + 冒号 + 时间戳）其中账户Id根据url的验证级别对应主账户
  // 2.冒号为英文冒号3.时间戳是当前系统时间，格式"yyyyMMddHHmmss"，需与SigParameter中时间戳相同。
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000; //随机4位验证码
  const expireMinute = '5'; // 验证码有效时长5分钟
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;
  console.log('************************************3434***********************************');
  const response =await request.post(
    url,
    {
      to,
      appId:AppId,
      templateId,
      datas: [verifyCode, expireMinute], //请求参数
    },
    {
      headers: {
        Authorization,  //添加Authorization头部
      },
    }
  );
  console.log('***********************************************************************');
  
    const {statusCode,statusMsg,templateSMS} = response as any
    if(statusCode==='000000'){
      session.verifyCode = verifyCode
      await session.save() //服务端内存中保存验证码  实际应该在redis中保存
      res.status(200).json({
        code: 0,
        msg:statusMsg,
        data:{
          templateSMS
        }
      });
    }else{
      res.status(200).json({
        code: statusCode,
        msg:statusMsg
      });
    }

}
