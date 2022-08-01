import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styles from './index.module.scss'
import { Input, Button, message, Select } from 'antd'
import { ChangeEvent, useEffect, useState } from "react";
import request from 'services/fetch'
import { useStore } from "store";
import { observer } from 'mobx-react-lite'
import { useRouter } from "next/router";
interface Itag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: Iuser[]
}
interface Iuser {
  id: number;
  nickname: string;
  avatar: string;
}
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);
const NewEditor = () => {
  const store = useStore();
  const { userId } = store.user.userInfo
  const { push } = useRouter()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("Hello world!!!");
  const [allTags, setAllTags] = useState<Itag[]>()
  const [tagIds, setTagIds] = useState([])
  const handlePublish = () => {
    if (!title) {
      message.error('请输入文章标题')
    } else {
      request.post('/api/article/publish', {
        title, content, tagIds
      }).then((res: any) => {
        if (res.code === 0) {
          userId ? push(`/user/${userId}`) : push('/')
          message.success('发布成功')
        } else {
          message.error('发布失败')
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

  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        setAllTags(res.data.allTags)
      }
    })
  }, [])
  const handleSelectTag = (value: []) => {
    setTagIds(value)
  }
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {
            allTags?.map((tag) => (
              <Select.Option key={tag.id} value={tag.id}>{tag.title}</Select.Option>
            ))
          }
        </Select>
        <Button className={styles.button} type="primary" onClick={handlePublish}>发布文章</Button>
      </div>
      <MDEditor value={content} height={1000} onChange={handleContentChange} />
    </div>
  );
}
(NewEditor as any).layout = null;
export default observer(NewEditor)