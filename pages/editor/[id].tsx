import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styles from './index.module.scss'
import { Input, Button, message, Select } from 'antd'
import { ChangeEvent, useState, useEffect } from "react";
import request from 'services/fetch'
import { observer } from 'mobx-react-lite'
import { useRouter } from "next/router";
import AppDataSource from 'db/index';
import { Article } from 'db/entity/index'
import { IUserInfo } from 'store/userStore'
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
  users: IUserInfo[];
  tags: [];
}
interface Iprops {
  article: Iarticle
}
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);
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
    relations: ['user', 'tags']
  })
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || []
    }
  }

}
const ModifyEditor = ({ article }: Iprops) => {
  const { push, query } = useRouter()
  const articleID = Number(query.id)
  const [title, setTitle] = useState(article.title || "");
  const [content, setContent] = useState(article.content || "");

  const [allTags, setAllTags] = useState([])
  const [selectTags] = useState(article.tags)
  const defaultTags: any = []
  selectTags.map((tag: Itag) => {
    return defaultTags.push(tag.title)
  })
  const [tagtitles, setTagtitles] = useState([])
  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        setAllTags(res.data.allTags)
      }
    })
  }, [])
  const handleSelectTag = (value: []) => {
    console.log(value, 'value************************************************************************************************');
    // if(tagtitles.includes())
    setTagtitles(value)
  }
  const handleModify = () => {
    if (!title) {
      message.error('请输入文章标题')
    } else {
      request.post('/api/article/update', {
        title, content, id: articleID, tagtitles
      }).then((res: any) => {
        if (res.code === 0) {
          articleID ? push(`/article/${articleID}`) : push('/')
          message.success('更新成功')
        } else {
          message.error('更新失败')
        }
      })
    }
  }
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleContentChange = (content: any) => {
    setContent(content)
  }
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        <Select
          defaultValue={defaultTags}
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {
            allTags.map((tag: Itag) => (
              <Select.Option key={tag.id} value={tag.title}>{tag.title}</Select.Option>
            ))
          }
        </Select>
        <Button className={styles.button} type="primary" onClick={handleModify}>更新文章</Button>
      </div>
      <MDEditor value={content} height={1000} onChange={handleContentChange} />
    </div>
  );
}
(ModifyEditor as any).layout = null;
export default observer(ModifyEditor)