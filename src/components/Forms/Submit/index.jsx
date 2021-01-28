import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { message } from 'antd'
import './index.css'

class Submit extends Component {
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

    if (data.length === 0) {
      message.warning('您忘了填写试卷数据！请检查！')
      return
    } else {
      message.loading({ content: '正在处理数据....', key: 'loading' })
      this.setState({ status: 'sending', text: '别着急' })
    }

    try {
      var req = { question_data: JSON.parse(data), token: token }
    } catch (error) {
      message.warning({ content: '你输入的试卷数据不正确或试卷数据不完整，请检查！', key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
      return
    }

    try {
      const { answerPaperRecordId } = req.question_data.data
      const response = await fetch(`/dev/api/paper/${answerPaperRecordId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(req),
      })

      const response_data = await response.json()
      message.destroy('loading')
      this.handleData(response_data)
    } catch (error) {
      message.error({ content: `请求发送失败，${error}`, key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
    }
  }

  handleData = (response_data) => {
    const { data, success, msg } = response_data
    if (success) {
      this.setState({ status: 'success', text: '再次解析' })
      message.success('答案解析完成')
      this.props.history.push(`/answer/${data}`)
    } else {
      message.error({ content: msg, key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
    }
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <button onClick={this.handleClick} id="submit" className={this.state.status}>
        {this.state.text}
      </button>
    )
  }
}

export default withRouter(Submit)
