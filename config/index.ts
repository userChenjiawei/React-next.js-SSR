export const ironOptions = {
    cookieName: process.env.SESSION_COOKIE_NAME as string,  //cookie 中设置的name
    password: process.env.SESSION_PASSWORD as string, //cookie中设置的密码
    cookieOptions: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    },
  };


//配置了ironOptions 在服务端session需要用到