import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import request from 'services/fetch';
import styles from './index.module.scss';
import { NextPage } from 'next';
import { useStore } from 'store';
import { useRouter } from "next/router";
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}
const UserProfile: NextPage = () => {
  const { push } = useRouter()
  const store = useStore();
  const { userId } = store.user.userInfo
  const [form] = Form.useForm();
  const handleSubmit = (values: any) => {
    request.post('/api/user/update', {
      ...values
    }).then((res: any) => {
      if (res.code == 0) {
        message.success('修改成功')
        push(`/user/${userId}`)
      } else {
        message.error('修改失败')
      }
    }
    )
  }
  useEffect(() => {
    request.get('/api/user/detail').then((res: any) => {
      if (res.code == 0) {
        form.setFieldsValue(res.data.userInfo)
      }
    })
  }, [form])
  return (
    <div className='content-layout'>
      <div className={styles.userProfile}>
        <h2>个人资料</h2>
        <div>
          <Form {...layout} form={form} className={styles.form} onFinish={handleSubmit}>
            <Form.Item label="用户名" name="nickname">
              <Input placeholder='请输入用户名'></Input>
            </Form.Item>
            <Form.Item label="职位" name="job">
              <Input placeholder='请输入职位'></Input>
            </Form.Item>
            <Form.Item label="个人介绍" name="introduce">
              <Input placeholder='请输入个人介绍'></Input>
            </Form.Item>
            <Form.Item className={styles.button} >
              <Button type='primary' htmlType='submit'>保存修改</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
};

export default observer(UserProfile);
