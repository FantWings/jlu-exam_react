import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'

export default class AnswerBody extends Component {
  state = {
    enable: false,
    answers: undefined,
  }

  componentDidMount() {
    PubSub.subscribe('answers_data', (_, data) => {
      this.setState({ answers: data, enable: true })
    })
  }

  render() {
    return (
      <div className="answersBody">{this.state.enable ? <AnswerProccesser data={this.state.answers} /> : <div />}</div>
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
  let rows = []
  for (const i in props.data) {
    rows.push(<AnswerRow data={props.data[i]} key={i} type_id={props.type_id} />)
  }
  return rows
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
