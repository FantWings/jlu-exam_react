import React, { Component } from 'react'
import { Pagination, message, Spin } from 'antd'
import './index.css'
import ListObject from './listObject'

import { BASE_URL } from '../../api'

export default class History extends Component {
  //初始化状态
  state = {
    isLoading: false,
    data: undefined,
    Total: 0,
  }

  componentDidMount = async () => {
    try {
      //设置页面为加载状态
      this.setState({ isLoading: true })
      //获取数据
      const response = await fetch(`${BASE_URL}/paper/lists`)
      const data = await response.json()
      //使用数据更新组件状态
      this.setState({ isLoading: false, data: data.data, total: data.msg.total })
    } catch (error) {
      //请求失败处理
      message.error(`数据获取失败，请重试！${error}`)
      this.setState({ isLoading: false })
    }
  }

  handleChange = async (index, limit) => {
    try {
      //设置页面为加载状态
      this.setState({ isLoading: true })
      //获取数据
      const response = await fetch(`${BASE_URL}/paper/lists?limit=${limit}&index=${index}`)
      const data = await response.json()
      //使用数据更新组件状态
      this.setState({ isLoading: false, data: data.data, total: data.msg.total })
    } catch (error) {
      //请求失败处理
      message.error(`数据获取失败，请重试！${error}`)
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { data, total } = this.state
    return (
      <div className="answer_contain">
        <h1 className="q_type">答案库</h1>
        <small class="smallTitle">这里收集了所有同学有史以来提交过的试卷数据</small>
        <Spin spinning={this.state.isLoading} tip="向服务器请求数据...." className="loader">
          <ListObject data={data}></ListObject>
        </Spin>
        <span id="pagination">
          <Pagination showSizeChanger defaultCurrent={1} total={total} onChange={this.handleChange}></Pagination>
        </span>
      </div>
    )
  }
}
