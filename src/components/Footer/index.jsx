import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'
export default class Footer extends Component {
  //初始化状态
  state = {
    isConnected: null,
    text: '正在联系服务器....',
  }

  //组件挂载后订阅消息
  componentDidMount() {
    this.pubsub_token = PubSub.subscribe('isConnected', (_, state) => {
      state
        ? this.setState({ isConnected: state, text: '服务器连接已建立' })
        : this.setState({ isConnected: state, text: '与服务器通讯失败' })
    })
  }

  //组件卸载后取消订阅消息
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsub_token)
  }

  render() {
    return (
      <footer>
        <ul>
          <li>
            版本 version 4.1c（<a href="https://reactjs.org">ReactJS</a>）
          </li>
          <li>
            <span id={this.state.isConnected ? 'connected' : 'disconnected'} className="ping"></span>
            {this.state.text}
          </li>
          <li>适用于 吉林大学弘成科技发展有限公司 学生作业系统</li>
          <li>
            源代码：<a href="https://github.com/FantWings/jlu_homework_helper">GitHub</a>
          </li>
        </ul>
      </footer>
    )
  }
}
