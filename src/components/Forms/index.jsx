import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import { Input } from 'antd'
import Submit from './Submit'
import './index.css'

export default class Forms extends Component {
  //创建ref容器
  data = React.createRef()
  token = React.createRef()

  //初始化状态
  state = {
    isAuthed: false,
  }

  //组件挂载时订阅消息
  componentDidMount() {
    this.pubsub_token = PubSub.subscribe('isAuthed', (_, isAuthed) => {
      this.setState({ isAuthed })
    })
  }

  //组件卸载时取消订阅
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsub_token)
  }

  render() {
    const { TextArea } = Input
    const { isAuthed } = this.state
    return (
      <form method="post" name="form">
        <TextArea
          showCount
          placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击菜单上的“使用教程”"
          autoSize={{ minRows: 20, maxRows: 20 }}
          allowClear
          ref={this.data}
        />
        <div id="key_feid">
          <h4>执行密钥</h4>
          <Input.Password
            placeholder={isAuthed ? '密钥处于有效期，无需重复输入' : '为了避免恶意请求，请输入执行密钥'}
            id="token"
            ref={this.token}
            disabled={isAuthed}
          />
          <p>
            <Submit data={this.data} token={this.token} />
          </p>
        </div>
      </form>
    )
  }
}
