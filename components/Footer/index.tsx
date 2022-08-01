import type { NextPage } from "next";
import styles from './index.module.scss'
const Footer: NextPage = () => {
    return (
        <div className={styles.footer}>我的个人博客（技术栈：Next.js+React） SSR服务端渲染</div>
    )
}

export default Footer