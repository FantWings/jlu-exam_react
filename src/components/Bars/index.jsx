import { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'

export default class Bars extends Component {
  state = {
    isNotices: false,
    status: '',
    title: '',
    text: '',
    paper_id: '',
    ip_addr: '',
  }

  componentDidMount() {
    PubSub.subscribe('barinfo', (_, data) => {
      this.setState({ ...data })
    })
  }

  render() {
    const { isNotices, status, title, text, paper_id, ip_addr } = this.state
    return isNotices ? (
      <span id="notices" className="bar error">
        <p>本工具仅供交流学习用途，请适度使用！任何因本工具导致的问题将不会为你付任何责任！</p>
        <small id="info">
          试卷号（UUID）：{paper_id} 丨 IP地址：{ip_addr}
        </small>
      </span>
    ) : (
      <span className={'bar ' + status} style={{ display: status ? 'block' : 'none' }}>
        <h3 id="msg_tittle">{title}</h3>
        <small id="msg_text">{text}</small>
      </span>
    )
  }
}
