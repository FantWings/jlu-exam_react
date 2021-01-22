import React, { Component } from 'react'
export default class Footer extends Component {
  state = {
    isConnected: null,
    text: '正在联系服务器....',
  }

  componentDidMount = async () => {
    // axios
    //   .get('ping')
    //   .then((response) => {
    //     if (response.status === 200) {
    //       this.setState({ isConnected: true, text: '服务器连接已建立' })
    //       console.log('嗯，服务看起来还没炸。')
    //     }
    //   })
    //   .catch((error) => {
    //     this.setState({ isConnected: false, text: '与服务器通讯失败' })
    //     console.log('日！服务器又双叒叕炸了！')
    //   })

    try {
      await fetch('https://api.htips.cn/jlu_helper/v1/ping')
      this.setState({ isConnected: true, text: '服务器连接已建立' })
      console.log('嗯，服务看起来还没炸。')
    } catch {
      this.setState({ isConnected: false, text: '与服务器通讯失败' })
      console.log('日！服务器又双叒叕炸了！')
    }
  }

  render() {
    return (
      <footer>
        <ul>
          <li>
            版本 version 2.3f（<a href="https://reactjs.org/">ReactJS</a>）
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
