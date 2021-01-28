import React, { Component } from 'react'
import PubSub from 'pubsub-js'

export default class State extends Component {
  state = {
    isLoading: false,
    isSuccess: false,
    count: false,
    authed: false,
  }

  componentDidMount = async () => {
    try {
      this.setState({ isLoading: true })
      const response = await fetch('https://api.htips.cn/jlu_helper/api/getState', {
        credentials: 'include',
        mode: 'cors',
      })
      const data = await response.json()
      const { count, authed } = data
      this.setState({ isSuccess: true, isLoading: false, count, authed })
    } catch {
      this.setState({ isSuccess: false, isLoading: false })
    }
    PubSub.publish('isConnected', this.state.isSuccess)
    PubSub.publish('isAuthed', this.state.authed)
  }

  render() {
    const { isSuccess, count, isLoading } = this.state
    return (
      <p id="s_title">
        {isLoading ? (
          <small id="notice">你身边最牛逼的作业小助手，统计数据加载中</small>
        ) : isSuccess ? (
          count ? (
            <small id="notice">
              你身边最牛逼的作业小助手，累计已处理<span> {count} </span>张试卷
            </small>
          ) : (
            <small id="notice">你身边最牛逼的作业小助手，使用统计功能未启用</small>
          )
        ) : (
          <small id="notice">你身边最牛逼的作业小助手，获取统计数据失败</small>
        )}
      </p>
    )
  }
}
