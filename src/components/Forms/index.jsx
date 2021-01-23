import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'

export default class Forms extends Component {
  data = React.createRef()
  token = React.createRef()
  render() {
    return (
      <form method="post" name="form">
        <textarea
          name="question"
          id="question_feid"
          required
          placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击“需要帮助”"
          ref={this.data}
        ></textarea>
        <div id="key_feid">
          <h4>执行密钥</h4>
          <input
            type="password"
            name="token"
            id="token"
            required
            placeholder="为了避免恶意请求，请输入执行密钥"
            ref={this.token}
          />
          <p>
            <SendQuestion data={this.data} token={this.token} />
          </p>
        </div>
      </form>
    )
  }
}

class SendQuestion extends Component {
  state = {
    status: 'ready',
    text: '提交',
  }

  handleClick = async (e) => {
    e.preventDefault()
    const {
      data: {
        current: { value: data },
      },
      token: {
        current: { value: token },
      },
    } = this.props

    const req = { question_data: data, token: token }

    PubSub.publish('barinfo', {
      status: 'info',
      title: '处理中',
      text: '服务器正在处理你的数据，这可能需要一点时间，请稍后....',
    })

    try {
      this.setState({ status: 'sending', text: '别着急' })
      const response = await fetch('/dev/v1/get_answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
      const data = await response.json()
      this.handleData(data)
    } catch (error) {
      PubSub.publish('barinfo', {
        status: 'error',
        title: '连接错误',
        text: '服务器连接失败，可能是网络连接超时，如果您确定不是网络问题，请联系开发者 微信@FantWings',
        // text: error.message,
      })
      this.setState({ status: 'failure', text: '重试一次' })
    }
  }

  handleData = (data) => {
    if (data.success) {
      this.setState({ status: 'success', text: '再次解析' })
      PubSub.publish('barinfo', {
        paper_id: data.paper_id,
        ip_addr: data.ip_addr,
        isNotices: true,
      })
      // ReactDOM.render(<AnswerProccesser data={data.answers} />, document.querySelector('#answer_container'))
      // window.scrollTo(0, 0)
      PubSub.publish('answers_data', data.answers)
    } else {
      PubSub.publish('barinfo', {
        status: 'error',
        title: '错误',
        text: data.error_msg,
      })
      this.setState({ status: 'failure', text: '重试一次' })
    }
  }

  render() {
    return (
      <button onClick={this.handleClick} id="submit" className={this.state.status}>
        {this.state.text}
      </button>
    )
  }
}
