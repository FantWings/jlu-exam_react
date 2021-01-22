import React from 'react'
import axios from '../../axios'

export default class UsageCount extends React.Component {
  state = {
    count: false,
    text: '使用统计功能未启用',
  }

  componentDidMount() {
    axios
      .get('get_user_count')
      .then((response) => this.setState({ count: response.data.count }))
      .catch(this.setState({ count: '读取中' }))
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
