import '../styles/globals.css'
// import type { AppProps } from 'next/app'
import Layout from 'components/layout'
import {StoreProvider}  from 'store/index'
import { NextPage } from 'next';
interface Iprops{
  initialValue:Record<any,any>;
  Component:NextPage;
  pageProps:any;
}
function MyApp({initialValue, Component, pageProps }: Iprops) {
  // {/* 这里的关键是 即便页面刷新 store中数据丢失 这里还是会重新从cookie中传入相应的值 */}
  const renderLayout = ()=>{
    if((Component as any).layout===null){
      return <Component {...pageProps} />
    }else{
      return (<Layout>
        <Component {...pageProps} /> 
      </Layout>)
    }
  }
  return (
<StoreProvider initialValue={initialValue}>  
    {renderLayout()}
</StoreProvider>
  )
}
MyApp.getInitialProps = async({ctx}:{ctx:any})=>{ //从cookies中取值  就算刷新页面了  还是通过initialValue传入了store
  // console.log('))))))))');
  // console.log(ctx.req.cookies);
  const {userId,nickname,avatar} = ctx?.req?.cookies ||{}
  return {
    initialValue:{
      user:{
        userInfo:{
          userId,nickname,avatar
        }
      }
    }
  }
  
}
export default MyApp
