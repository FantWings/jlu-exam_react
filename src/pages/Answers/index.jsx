import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'
import Renamer from './Renamer'
import { message } from 'antd'

export default class AnswerBody extends Component {
  state = {
    paper_id: undefined,
    submit_time: undefined,
    isOwner: undefined,
    answers: undefined,
    paper_name: false,
  }

  componentDidMount = async () => {
    try {
      const response = await fetch(`/dev/api/paper/${this.props.match.params.paper_id}`)
      const data = await response.json()

      if (data.success) {
        this.setState({ ...data.data })
        const { paper_id, submit_time } = this.state

        PubSub.publish('barinfo', {
          paper_id: paper_id,
          submit_time: submit_time,
          isNotices: true,
        })
        window.scrollTo(0, 0)
      } else {
        message.error(`错误！${data.msg}`)
        return
      }
    } catch (error) {
      message.error(`答案数据下载失败！${error}`)
    }
  }

  render() {
    const { paper_id, answers, isOwner, paper_name } = this.state
    return (
      <div className="answersBody">
        <Renamer paper_id={paper_id} paper_name={paper_name} isOwner={isOwner} />
        <AnswerProccesser data={answers} />
      </div>
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
      rows.push(<AnswerBlock answer_data={props.data[key]} type_id={key} key={key} />)
    }
  }
  rows.push(
    <span className="liner" key="liner_foot">
      <span className="liner_text">再次解析</span>
    </span>
  )
  return rows
}

function AnswerBlock(props) {
  const { answer, type_name } = props.answer_data
  return (
    <div className="answer_contain">
      <h3 className="q_type">{type_name}</h3>
      <AnswerList data={answer} type_id={props.type_id} />
    </div>
  )
}

function AnswerList(props) {
  return props.data.map((data) => {
    return <AnswerRow data={data} key={data.uuid} type_id={data.type_id} />
  })
}

class AnswerRow extends Component {
  state = {
    isSelected: false,
  }

  handleClick = (e) => {
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
