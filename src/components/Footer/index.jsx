import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'
export default class Footer extends Component {
  state = {
    isConnected: null,
    text: '正在联系服务器....',
  }

  componentDidMount() {
    PubSub.subscribe('isConnected', (_, state) => {
      state
        ? this.setState({ isConnected: state, text: '服务器连接已建立' })
        : this.setState({ isConnected: state, text: '与服务器通讯失败' })
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe('isConnected')
  }

  render() {
    return (
      <footer>
        <ul>
          <li>
            版本 version 3.1r（<a href="https://reactjs.org/">ReactJS</a>）
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
