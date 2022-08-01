// import type { NextPage } from "next"
import { Divider, Tabs } from 'antd'
import React, { useState, useEffect } from 'react';
const { TabPane } = Tabs;
import { Article } from '../db/entity/index';
import AppDataSource from 'db/index';
import ListItem from 'components/ListItem/index'
import { IUserInfo } from 'store/userStore'
import request from 'services/fetch'

type Iarticle = {
  id: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  is_delete: number;
  views: number;
  user: IUserInfo;
  tags: Itag[]
}
interface Iprops {
  articles: Iarticle[]
}
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

export async function getServerSideProps() {
  await AppDataSource.initialize()
    .then(async () => {
      //   前两次必定失败 不知道为什么
    }) //似乎是数据库的初始化
    .catch((error) => console.log(error));
  const articles = await AppDataSource.getRepository(Article).find({
    relations: ['user', 'tags']
  })
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || []
    }
  }

}
const Home = (props: Iprops) => {
  const { articles } = props
  // const [followTags, setFollowTags] = useState<Itag[]>()
  const [allTags, setAllTags] = useState([])


  useEffect(() => {
    //刚进来的时候调用一次
    request('/api/tag/get').then((res: any) => {
      if (res.code == 0) {
        const { allTags } = res.data
        // setFollowTags(followTags)
        setAllTags(allTags)
        // message.success('获取成功')
      }
    })
  }, [])

  //获取存在相应标签的文章 对他进行分类
  return (
    <div>
      <div className='content-layout'>
        <Tabs defaultActiveKey="All">
          {
            allTags.map((tag: Itag, index) => (
              <TabPane tab={tag.title} key={index}>
                {
                  articles.map((article) => (
                    article.tags.map(item => (
                      item.id == tag.id ?
                        <div key={article.id}>   <ListItem article={article} ></ListItem>
                          <Divider key={article.id} /></div>
                        : ""
                    ))

                  ))
                }
              </TabPane>
            ))

          }
          <TabPane tab="All" key="All">
            {
              articles.map((article) => (
                <div key={article.id}>
                  <ListItem article={article} ></ListItem>
                  <Divider key={article.title} />
                </div>
              ))
            }
          </TabPane>

        </Tabs>

      </div>
    </div >
  )
}
export default Home 