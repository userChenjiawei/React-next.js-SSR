import type { NextPage } from "next";
import { navs } from "./config";
import Link from "next/link";
import styles from './index.module.scss'
import { useRouter } from "next/router";
import { Button, message } from "antd";
import { useState } from "react";
import Login from "components/Login";
import { useStore } from "store";
import { Avatar, Dropdown, Menu } from 'antd'
import { LoginOutlined, HomeOutlined } from '@ant-design/icons'
import request from '../../services/fetch'
import { observer } from 'mobx-react-lite'
const Navbar: NextPage = () => {
    const store = useStore();
    const { userId, avatar } = store.user.userInfo

    const { pathname, push } = useRouter()
    const handleGetoEditPage = () => {
        if (userId) {
            push('editor/new') // 不用request.post的原因是，这里只是跳转页面
        } else {
            message.error('请先登录')
        }
    }
    const handleLogin = () => {
        setIsShowLogin(true)
    }
    const [isShowLogin, setIsShowLogin] = useState(false)
    const handleClose = () => {
        setIsShowLogin(false)
    }
    const renderDropDownMenu = () => {
        return (
            <Menu>
                <Menu.Item onClick={handleGotoPersonPage} key={1}><HomeOutlined></HomeOutlined>个人主页</Menu.Item>
                <Menu.Item onClick={handleLogout} key={2}><LoginOutlined></LoginOutlined>退出系统</Menu.Item>
            </Menu>
        )
    }
    const handleGotoPersonPage = () => {
        push(`/user/${userId}`)
    }
    const handleLogout = () => {
        request.post('/api/user/logout').then((res: any) => {
            if (res.code === 0) {
                store.user.setUserInfo({})
            }
        })
    }
    return (
        <div className={styles.navbar}>
            <section className={styles.logoArea}>MyBlog</section>
            <section className={styles.linkArea}>
                {
                    navs?.map((nav) => (
                        <Link key={nav?.label} href={nav?.value}>
                            <a className={pathname === nav?.value ? styles.active : ""}>{nav?.label}</a>
                        </Link>
                    ))
                }
            </section>
            <section className={styles.operationArea}>
                <Button onClick={handleGetoEditPage}>写文章</Button>
                {
                    userId ? (

                        <>
                            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
                                <Avatar src={avatar} size={32}></Avatar>
                            </Dropdown></>

                    ) : (<Button type="primary" onClick={handleLogin}>登陆</Button>)
                }

            </section>
            <Login isShow={isShowLogin} onClose={handleClose}></Login>
        </div>
    )
}

export default observer(Navbar)