import { Button, message, Tabs } from 'antd';
const { TabPane } = Tabs;
import React, { useState, useEffect } from 'react';
import request from 'services/fetch'
import { observer } from 'mobx-react-lite'
import { useStore } from "store";
import styles from './index.module.scss'
import * as ANTD_ICON from '@ant-design/icons'
interface Iuser {
  id: number;
  nickname: string;
  avatar: string;
}
interface Itag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: Iuser[]
}



const Tag: React.FC = () => {

  const store = useStore();
  const [followTags, setFollowTags] = useState<Itag[]>()
  const [allTags, setAllTags] = useState<Itag[]>()
  const { userId } = store.user.userInfo;
  const [needRefresh, setNeedRefresh] = useState(false)

  useEffect(() => {
    //刚进来的时候调用一次
    request('/api/tag/get').then((res: any) => {
      if (res.code == 0) {
        const { followTags, allTags } = res.data
        setFollowTags(followTags)
        setAllTags(allTags)
        // message.success('获取成功')
      }
    })
  }, [needRefresh])
  const handleUnFollow = (tagId: number) => {
    request.post('/api/tag/follow', {
      type: 'unFollow',
      tagId
    }).then((res: any) => {
      if (res.code == 0) {
        message.success('取关成功')
        setNeedRefresh(!needRefresh)
      } else {
        message.success('取关失败')

      }
    })
  }
  const handleFollow = (tagId: number) => {
    request.post('/api/tag/follow', {
      type: 'follow',
      tagId
    }).then((res: any) => {
      if (res.code == 0) {
        message.success('关注成功')
        setNeedRefresh(!needRefresh)
      } else {
        message.success('关注失败')
      }
    })
  }
  return (
    <div className='content-layout'>
      <Tabs defaultActiveKey="all">
        <TabPane tab="已关注标签" key="follow" className={styles.tags}>
          {
            followTags?.map((tag) => (
              <div key={tag.title} className={styles.tagWrapper}>
                <div>{(ANTD_ICON as any)[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag.title}</div>
                <div>{tag.follow_count}关注{tag.article_count}</div>
                {
                  tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
                    <Button type="dashed" onClick={() => { handleUnFollow(tag?.id) }}>取消关注</Button>
                  ) : <Button type="primary" onClick={() => { handleFollow(tag?.id) }}>关注</Button>
                }
              </div>
            ))

          }
        </TabPane>
        <TabPane tab="全部标签" key="all" className={styles.tags}>
          {
            allTags?.map((tag) => (
              <div key={tag.title} className={styles.tagWrapper}>
                <div>{(ANTD_ICON as any)[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag.title}</div>
                <div>{tag.follow_count}关注{tag.article_count}</div>
                {
                  tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
                    <Button type="primary" onClick={() => { handleUnFollow(tag?.id) }}>已关注</Button>
                  ) : <Button onClick={() => { handleFollow(tag?.id) }}>关注</Button>
                }
              </div>
            ))
          }
        </TabPane>

      </Tabs>
    </div>
  )
}
export default observer(Tag)