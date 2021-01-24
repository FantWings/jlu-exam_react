import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import { message, Input } from 'antd'
import './index.css'

export default class Forms extends Component {
  data = React.createRef()
  token = React.createRef()

  render() {
    const { TextArea } = Input
    return (
      <form method="post" name="form">
        {/* <textarea name="question" id="question_feid" required></textarea> */}
        <TextArea
          showCount
          placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击“需要帮助”"
          autoSize={{ minRows: 20, maxRows: 20 }}
          allowClear
          ref={this.data}
        />
        <div id="key_feid">
          <h4>执行密钥</h4>
          <Input.Password placeholder="为了避免恶意请求，请输入执行密钥" id="token" ref={this.token} />
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
        current: {
          resizableTextArea: {
            props: { value: data },
          },
        },
      },
      token: {
        current: {
          clearableInput: {
            props: { value: token },
          },
        },
      },
    } = this.props

    const req = { question_data: data, token: token }

    try {
      message.loading({
        content: '服务器正在处理你的数据，这可能需要一点时间，请稍后....',
        key: 'loading',
        style: {
          marginTop: '2vh',
        },
      })

      this.setState({ status: 'sending', text: '别着急' })

      const response = await fetch('https://api.htips.cn/jlu_helper/v1/get_answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })

      const data = await response.json()
      message.destroy('loading')
      this.handleData(data)
    } catch (error) {
      message.error({
        content: '服务器连接失败，可能是网络连接超时，如果您确定不是网络问题，请联系开发者 微信@FantWings',
        key: 'loading',
        style: {
          marginTop: '2vh',
        },
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
      PubSub.publish('answers_data', data.answers)
      message.success({
        content: '答案解析完成',
        style: {
          marginTop: '2vh',
        },
      })
    } else {
      message.error({
        content: data.error_msg,
        key: 'loading',
        style: {
          marginTop: '2vh',
        },
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
