// import type { NextPage } from "next"
import { Article } from 'db/entity/index'
import AppDataSource from 'db/index';
import { IUserInfo } from 'store/userStore'
import styles from './index.module.scss'
import { Avatar, Input, Button, message, Divider } from 'antd'
import { useStore } from "store";
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { format } from 'date-fns'
import MarkDown from 'markdown-to-jsx'
import { useState } from 'react';
import request from 'services/fetch'
interface IComment {
  create_time: Date;
  update_time: Date;
  content?: string;
  id?: number;
  user: Iuser
}
interface Iuser {
  avatar?: string;
  nickname?: string;
}

interface Iarticle {
  id: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  is_delete: number;
  views: number;
  user: IUserInfo;
  comments: IComment[]
}
interface Iprops {
  article: Iarticle
}
//SSR的页面
export async function getServerSideProps({ params }: any) {
  const articleID = params.id //从params中获取文章的id
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const articleRepo = AppDataSource.getRepository(Article)
  const article = await articleRepo.findOne({
    where: {
      id: articleID
    },
    relations: ['user', 'comments', 'comments.user']
  })
  console.log(article, 'totototo');

  if (article) {
    article.views = article.views + 1
    articleRepo.save(article)
  }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || []
    }
  }

}
const Home = (props: Iprops) => {
  const store = useStore();
  const { userId } = store.user.userInfo

  const [inputValue, setInputValue] = useState('')
  const { article } = props
  const { user: { nickname, avatar, id } } = article
  const [comments, setComments] = useState<IComment[]>(article.comments)
  const handleComment = () => {
    request.post('/api/comment/publish', {
      content: inputValue, articleId: article.id
    }).then((res: any) => {
      if (res.code == 0) {
        setInputValue('')
        message.success('发表成功')
        const com: IComment = {
          id: Math.random(),
          create_time: new Date(),
          update_time: new Date(),
          content: inputValue,
          user: {
            avatar: avatar,
            nickname: nickname
          }
        }
        const newComments: IComment[] = [
          com
        ].concat([...comments])
        setComments(newComments)
      } else {
        message.error('发表失败')
      }
    })
  }
  return (
    <div>
      <div className='content-layout'>
        <h2 className={styles.title}>{article.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar}></Avatar>
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>{format(new Date(article.update_time), 'yyyy-MM-dd hh:mm:ss')}</div>
              <div>阅读{article.views}</div>
              {
                Number(userId) == Number(id) && (
                  <Link href={`/editor/${article.id}`}>编辑</Link>
                )
              }
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article.content}</MarkDown>

      </div>
      <div className={styles.divider}></div>
      <div className='content-layout'>
        <div className={styles.comment}>
          <h3>评论</h3>
          {
            userId && (
              <div className={styles.enter}>
                <Avatar src={avatar} size={40}></Avatar>
                <div className={styles.content}>
                  <Input.TextArea placeholder='请输入评论' rows={4} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  <Button type='primary' onClick={handleComment}>发表评论</Button>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <div className={styles.divider}></div>
      {/* <Divider></Divider> */}
      <div className='content-layout'>
        <div className={styles.display}>
          {
            comments.map((comment: any) => (
              <><div className={styles.wrapper} key={comment.id}>
                <Avatar src={comment.user.avatar} size={40}></Avatar>
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment.user.nickname}</div>
                    <div className={styles.date}>{format(new Date(comment.update_time), 'yyyy-MM-dd hh:mm:ss')}</div>
                  </div>
                  <div className={styles.content}>{comment.content}</div>
                </div>
              </div><Divider></Divider></>
            ))

          }
        </div>
      </div>
    </div>
  )
}
export default observer(Home)