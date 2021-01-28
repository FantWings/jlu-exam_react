import React, { Component } from 'react'
import { message } from 'antd'
import './index.css'

export default class Renamer extends Component {
  state = { newPaperName: '' }

  handleChange = (event) => {
    this.setState({ newPaperName: event.target.value })
  }

  sendRequest = async () => {
    const { newPaperName } = this.state
    if (newPaperName.length >= 4) {
      try {
        const req = { paper_id: this.props.paper_id, new_name: newPaperName }
        const response = await fetch('/dev/api/paper/setPaperName', {
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
        if (response_data.success) {
          this.setState({ loading: false })
          message.success({
            content: response_data.msg,
            style: {
              marginTop: '2vh',
            },
          })
        } else {
          message.error({
            content: response_data.msg,
            style: {
              marginTop: '2vh',
            },
          })
        }
      } catch (error) {
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
