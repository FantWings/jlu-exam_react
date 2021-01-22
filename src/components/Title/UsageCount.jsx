import React, { Component } from 'react'
// import axios from '../../axios'

export default class UsageCount extends Component {
  state = {
    isLoading: false,
    isSuccess: false,
    count: false,
  }

  componentDidMount = async () => {
    try {
      this.setState({ isLoading: true })
      const response = await fetch('https://api.htips.cn/jlu_helper/v1/get_user_count')
      const data = await response.json()
      this.setState({ isSuccess: true, count: data.count, isLoading: false })
    } catch {
      this.setState({ isSuccess: false })
    }
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
              你身边最牛逼的作业小助手，累计已被<span> {count} </span>位同学使用
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
