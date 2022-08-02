
import Link from 'next/link'
import styles from './index.module.scss'
import { EyeOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { IUserInfo } from 'store/userStore'
import { formatDistanceToNow } from 'date-fns'
type Iarticle = {
    id: number;
    title: string;
    content: string;
    create_time: Date;
    update_time: Date;
    is_delete: number;
    views: number;
    user: IUserInfo;
}
interface Ipros {
    article: Iarticle
}
const ListItem = (props: Ipros) => {
    const { article } = props
    const { user } = article
    return (
        <Link key={article?.id} href={`/article/${article.id}`}>
            <div className={styles.container}>
                <div className={styles.article}>
                    <div className={styles.userInfo}>
                        <span className={styles.name}>{user.nickname}</span>
                        <span className={styles.date}>{formatDistanceToNow(new Date(article.update_time))}</span>
                    </div>

                    <h4 className={styles.title}>{article.title}</h4>
                    <p className={styles.content}>{article.content}</p>
                    <div className={styles.statistics}>
                        <EyeOutlined></EyeOutlined>
                        <span>{article.views}</span>
                    </div>
                </div>
                <Avatar src={user.avatar} size={48} />
            </div>
        </Link>
    )
}

export default ListItem