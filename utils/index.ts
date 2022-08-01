interface IcookieInfo {
  id: number;
  nickname: string;
  avatar: string;
} //定义输入对象的类型 要不然会报错

export const setCookie = (
  cookies: any,
  { id, nickname, avatar }: IcookieInfo
) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); //定义有效时长
  const path = '/'; //当前路径
  cookies.set('userId', id, {
    path,
    expires,
  }); //set(name: string, value: any, options?: CookieSetOptions): void;
  cookies.set('nickname', nickname, {
    path,
    expires,
  });
  cookies.set('avatar', avatar, {
    path,
    expires,
  });
};
export const clearCookie = (cookies: any) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';
  cookies.set('userId', '', {
    path,
    expires,
  });
  cookies.set('nickname', '', {
    path,
    expires,
  });
  cookies.set('avatar', '', {
    path,
    expires,
  });
};
