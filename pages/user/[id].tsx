import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import styles from './index.module.scss'
import { Button, Avatar, Divider } from 'antd'
import { CodeOutlined, FileOutlined, FundViewOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import AppDataSource from 'db/index';
import { Article, User } from 'db/entity/index'
import { IUserInfo } from 'store/userStore'
import Link from "next/link"
import ListItem from 'components/ListItem/index'
interface Itag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
}
type Iarticle = {
  id: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  is_delete: number;
  views: number;
  user: IUserInfo;
  tags: Itag[];
}
interface Iprops {
  articles: Iarticle[];
  user: IUserInfo
}
export async function getServerSideProps({ params }: any) {
  const userID = params.id //从params中获取文章的id
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const userRepo = AppDataSource.getRepository(User)
  const articleRepo = AppDataSource.getRepository(Article)
  const user = await userRepo.findOne({
    where: {
      id: Number(userID)
    }
  })
  console.log();

  const articles = await articleRepo.find({
    where: {
      user: {
        id: Number(userID)
      }
    },
    relations: ['user', 'tags']
  })
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      user: JSON.parse(JSON.stringify(user)) || []
    }
  }

}
const userDetail = ({ articles, user }: Iprops) => {
  const viewsCount = articles.reduce((pre: any, next: any) => pre + next.views, 0)
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={user.avatar} size={90}></Avatar>
          <div>
            <div className={styles.nickname}>{user.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined />{user.job}
            </div>
            <div className={styles.desc}>
              <FileOutlined />{user.introduce}
            </div>
          </div>
          <Link href="/user/profile"><Button>编辑个人资料</Button></Link>
        </div>
        <Divider></Divider>
        <div className={styles.article}>
          {
            articles.map(article => (
              <div key={article.id}>
                <ListItem article={article}></ListItem>
                <Divider></Divider>
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined></FundViewOutlined>
              <span>共创作{articles.length}篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined></FundViewOutlined>
              <span>文章被阅读{viewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(userDetail)