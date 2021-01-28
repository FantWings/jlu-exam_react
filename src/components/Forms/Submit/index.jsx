import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { message } from 'antd'
import './index.css'

class Submit extends Component {
  //初始化状态
  state = {
    status: 'ready',
    text: '提交',
  }

  //承接用户点击操作
  handleClick = async (e) => {
    //拦截默认动作
    e.preventDefault()
    //多重解构赋值+重命名变量
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

    //判断用户是否输入了内容
    if (data.length === 0) {
      message.warning('您忘了填写试卷数据！请检查！')
      return
    } else {
      message.loading({ content: '正在处理数据....', key: 'loading' })
      this.setState({ status: 'sending', text: '别着急' })
    }

    //判断用户是否输入的是垃圾数据
    try {
      var req = { question_data: JSON.parse(data), token: token }
    } catch (error) {
      message.warning({ content: '你输入的试卷数据不正确或试卷数据不完整，请检查！', key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
      return
    }

    //向服务器发送试卷数据
    try {
      const { answerPaperRecordId } = req.question_data.data
      const response = await fetch(`https://api.htips.cn/jlu_helper/api/paper/${answerPaperRecordId}`, {
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

      //接到数据后转交给handleData函数处理
      this.handleData(response_data)
    } catch (error) {
      //请求失败处理
      message.error({ content: `请求发送失败，${error}`, key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
    }
  }

  //数据处理函数，主要是分析服务器发回来可能的错误，并调用MessageAPI展示给用户
  handleData = (response_data) => {
    //解构赋值
    const { data, success, msg } = response_data
    //处理成功，将用户路由到答案显示页面
    if (success) {
      this.setState({ status: 'success', text: '再次解析' })
      message.success('答案解析完成')
      this.props.history.push(`/answer/${data}`)
    } else {
      //处理失败，报错，并让用户重试
      message.error({ content: msg, key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
    }
    //重定向用户浏览器视口到顶部
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
