// import { NextPage } from "next";
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss'
import CountDown from 'components/CountDown'
import {message} from 'antd'
import request from '../../services/fetch'
import {useStore} from 'store/index'
import {observer} from 'mobx-react-lite'
interface iProps{
    isShow:boolean;
    onClose:Function
}
 const Login = (props:iProps)=>{
    const store = useStore()
    const {isShow,onClose} = props
    const handleClose = ()=>{
        onClose && onClose()
    }
    const [form,SetForm] = useState({
        phone:'',
        verify:''
    })
    const [isShowVerifyCode,setIsShowVerifyCode] = useState(false)
    const handleVerifyCode = ()=>{
        if(!form.phone){           
            message.warning('请输入手机号');  
            return
        }
        request.post('/api/user/sendVerifyCode',{
            to:form.phone,
            templateId:1,
             
        }).then((res:any)=>{
            if(res.code===0){
                setIsShowVerifyCode(true)
            }else{
                message.error(res?.msg || '未知错误')
            }
        })


    }
    const handleLogin = ()=>{

        request.post('/api/user/login',
            {...form,identity_type:'phone'}
        ).then((res:any)=>{
            if(res.code===0){
                message.success('登陆成功') 
                store.user.setUserInfo(res?.data)             
                onClose && onClose()
            }else{
                message.error(res.msg||'未知错误')
            }
        })
    }
    const handleGithubLogin = ()=>{
        const githubClientId = 'fa85641c7c1a32b9d85c';
        const redirectUrl = 'http://localhost:3000/api/oauth/redirect'
        window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUrl}`) 
    }
    const handleFormChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target
        SetForm({
            ...form,
            [name]:value 
        })
    }
    const handleCountDownEnd = ()=>{

        setIsShowVerifyCode(false)
    }
    return (
       isShow?
       <div className={styles.loginArea}>
        <div className={styles.loginBox}>
            <div className={styles.loginText}>
                <div>手机号登陆</div>
                <div className={styles.close} onClick={handleClose}>X</div>
            </div>
            <input onChange={handleFormChange} type="text" name='phone' placeholder='请输入手机号' value={form.phone}/>
            <div className={styles.verifyCodeArea}>
                <input onChange={handleFormChange} type="text" name='verify' placeholder='请输入验证码' value={form.verify} />
                <span className={styles.verifyCode} onClick={handleVerifyCode}>
                   {isShowVerifyCode?<CountDown time={10} onEnd={handleCountDownEnd}/> :'获取验证码'}</span>
            </div>
            <div className={styles.loginButton} onClick={handleLogin}>登陆</div>
            <div className={styles.otherLogin} onClick={handleGithubLogin}>使用Github登陆</div>
            <div className={styles.loginPrivacy}>
                注册登陆即表示同意
                <a href="https://moco.imooc.com/privacy.html" target="_blank" rel="noreferrer">隐私政策</a>
            </div>
        </div>
       </div>
        :null
    )
}


export default observer(Login)