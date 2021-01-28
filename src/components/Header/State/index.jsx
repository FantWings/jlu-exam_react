import React, { Component } from 'react'
import PubSub from 'pubsub-js'

export default class State extends Component {
  //初始化状态
  state = {
    isLoading: false,
    isSuccess: false,
    count: false,
    authed: false,
  }

  //组件挂载时向服务器发起异步请求，获取用户登录态
  componentDidMount = async () => {
    try {
      this.setState({ isLoading: true })
      const response = await fetch('https://api.htips.cn/jlu_helper/api/getState', {
        credentials: 'include',
        mode: 'cors',
      })
      const data = await response.json()
      //将响应数据解构赋值
      const { count, authed } = data
      //使用数据更新组件状态
      this.setState({ isSuccess: true, isLoading: false, count, authed })
    } catch {
      //请求失败处理
      this.setState({ isSuccess: false, isLoading: false })
    }
    //状态发布
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
