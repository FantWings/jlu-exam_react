import React from 'react'
import ReactDOM from 'react-dom'
import axios from '../../axios'
import Bars from '../Bars'
import Notices from '../Notices'

export default function EZforms() {
  return (
    <form method="post" name="form">
      <textarea
        name="question"
        id="question_feid"
        required
        placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击“需要帮助”"
      ></textarea>
      <div id="key_feid">
        <h4>执行密钥</h4>
        <input type="password" name="token" id="token" required placeholder="为了避免恶意请求，请输入执行密钥" />
        <p>
          <SendQuestion />
        </p>
      </div>
    </form>
  )
}

class SendQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'ready',
      text: '提交',
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleData = this.handleData.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    let data = {
      question_data: document.querySelector('#question_feid').value,
      token: document.querySelector('#token').value,
    }

    // fetch(server_url + '/get_answer', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    //   mode: 'cors',
    //   credentials: 'omit',
    // })
    //   .then((response) => response.json().then((json) => this.handleData(json)))
    //   .catch((e) => {
    //     ReactDOM.render(
    //       <Bars
    //         status="error"
    //         title="连接错误"
    //         text="服务器连接失败，可能是网络连接超时，如果您确定不是网络问题，请联系开发者 微信@FantWings"
    //       />,
    //       document.querySelector('#bar_container')
    //     )
    //     this.setState({ status: 'failure', text: '重试一次' })
    //   })

    axios
      .request({
        method: 'post',
        url: '/get_answer',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
      })
      .then((response) => this.handleData(response.data))
      .catch((error) => console.log(error))

    ReactDOM.render(
      <Bars status="info" title="处理中" text="服务器正在处理你的数据，这可能需要一点时间，请稍后...." />,
      document.querySelector('#bar_container')
    )
    this.setState({ status: 'sending', text: '别着急' })
  }

  handleData(data) {
    if (data.status === 'success') {
      this.setState({ status: 'success', text: '再次解析' })
      ReactDOM.render(
        <Notices paper_id={data.paper_id} ip_addr={data.ip_addr} />,
        document.querySelector('#bar_container')
      )
      ReactDOM.render(<AnswerProccesser data={data.answers} />, document.querySelector('#answer_container'))
      window.scrollTo(0, 0)
    } else if (data.status === 'error') {
      ReactDOM.render(
        <Bars status={data.status} title="错误" text={data.error_msg} />,
        document.querySelector('#bar_container')
      )
      this.setState({ status: 'failure', text: '重试一次' })
    } else {
      ReactDOM.render(
        <Bars status={data.status} title="服务器内部错误" text={data.error_msg} />,
        document.querySelector('#bar_container')
      )
      this.setState({ status: 'failure', text: '重试一次' })
    }
  }

  render() {
    return (
      <a href="/#" onClick={this.handleClick} id="submit" className={this.state.status}>
        {this.state.text}
      </a>
    )
  }
}

function AnswerProccesser(props) {
  let rows = []
  rows.push(
    <span className="liner" key="liner_head">
      <span className="liner_text">标准答案</span>
    </span>
  )
  for (const key in props.data) {
    if (Object.keys(props.data[key].answer).length > 0) {
      rows.push(<AnswerContain answer_data={props.data[key]} type_id={key} key={key} />)
    }
  }
  rows.push(
    <span className="liner" key="liner_foot">
      <span className="liner_text">再次解析</span>
    </span>
  )
  return rows
}

function AnswerContain(props) {
  return (
    <div className="answer_contain">
      <h3 className="q_type">{props.answer_data.type_name}</h3>
      <AnswerList data={props.answer_data.answer} type_id={props.type_id} />
    </div>
  )
}

function AnswerList(props) {
  let rows = []
  for (const i in props.data) {
    rows.push(<AnswerBlock data={props.data[i]} key={i} type_id={props.type_id} />)
  }
  return rows
}

class AnswerBlock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    this.setState({ isSelected: !this.state.isSelected })
  }

  render() {
    return (
      <div className="answer_block" id={this.state.isSelected ? 'selected' : ''} onClick={this.handleClick}>
        <span className={'answer ' + this.props.type_id}>{this.props.data.answer}</span>
        <div>
          <span className="q_id">
            <small id="question_id">{this.props.data.question_id}</small>
            <small id="question_type">{this.props.data.question_type}</small>
          </span>
          <span className="question">{this.props.data.question}</span>
        </div>
      </div>
    )
  }
}
