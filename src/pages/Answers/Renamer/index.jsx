import React, { Component } from 'react'
import { message } from 'antd'
import './index.css'

export default class Renamer extends Component {
  //初始化状态
  state = { newPaperName: '' }

  //监测输入框变化
  handleChange = (event) => {
    this.setState({ newPaperName: event.target.value })
  }

  //向服务器异步发送更名请求
  sendRequest = async () => {
    //状态解构赋值
    const { newPaperName } = this.state
    //判断试卷名是否大于4位，大于则在输入框失去焦点时发送请求
    if (newPaperName.length >= 4) {
      try {
        const req = { paper_id: this.props.paper_id, new_name: newPaperName }
        const response = await fetch('https://api.htips.cn/jlu_helper/api/paper/setPaperName', {
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
        //请求成功处理
        if (response_data.success) {
          this.setState({ loading: false })
          message.success({
            content: response_data.msg,
            style: {
              marginTop: '2vh',
            },
          })
        } else {
          //请求成功但服务器返回失败消息处理
          message.error({
            content: response_data.msg,
            style: {
              marginTop: '2vh',
            },
          })
        }
      } catch (error) {
        //完全请求失败处理
        message.error({
          content: '试卷命名失败，请稍后再试！',
          key: 'loading',
        })
      }
    }
  }

  render() {
    const { paper_name, isOwner } = this.props
    return (
      <span id="paper_name">
        <h2>
          《
          <input
            type="text"
            placeholder={paper_name ? paper_name : isOwner ? '点此处给这个试卷命名' : '没有试卷名称修改权限'}
            onChange={this.handleChange}
            onBlur={this.sendRequest}
            disabled={!isOwner}
          />
          》
        </h2>
      </span>
    )
  }
}
