import React from 'react'

export default class UsageCount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: false,
      text: '使用统计功能未启用',
    }
  }

  componentDidMount() {
    fetch('http://127.0.0.1:5000/v1/get_user_count').then((response) =>
      response
        .json()
        .then((json) => {
          this.setState({ count: json.count })
        })
        .catch(this.setState({ count: '统计数据获取失败' }))
    )
  }

  render() {
    if (this.state.count) {
      return (
        <p id="s_title">
          <small id="notice">
            你身边最牛逼的作业小助手，累计已被<span> {this.state.count} </span>位同学使用
          </small>
        </p>
      )
    } else {
      return (
        <p id="s_title">
          <small id="notice">你身边最牛逼的作业小助手，{this.state.text}</small>
        </p>
      )
    }
  }
}
