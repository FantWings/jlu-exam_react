import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'
import Renamer from './Renamer'
import { message, Spin } from 'antd'

export default class AnswerBody extends Component {
  //初始化函数
  state = {
    loading: true,
    paper_id: undefined,
    submit_time: undefined,
    isOwner: undefined,
    answers: undefined,
    paper_name: false,
  }

  //组件挂载后的动作函数
  componentDidMount = async () => {
    //向服务器请求试卷数据
    try {
      const response = await fetch(`https://api.htips.cn/jlu_helper/api/paper/${this.props.match.params.paper_id}`, {
        credentials: 'include',
        mode: 'cors',
      })
      const data = await response.json()

      //请求成功后的操作
      if (data.success) {
        //向状态直接赋值
        this.setState({ ...data.data, loading: false })
        const { paper_id, submit_time } = this.state

        //向Bar组件发布消息
        PubSub.publish('barinfo', {
          paper_id: paper_id,
          submit_time: submit_time,
          isNotices: true,
        })
        //将用户浏览器视口重置到顶部
        window.scrollTo(0, 0)
      } else {
        //服务器请求成功，但返回失败的结果处理
        this.setState({ loading: false })
        message.error(`错误！${data.msg}`)
        return
      }
    } catch (error) {
      //连接服务器失败结果处理
      this.setState({ loading: false })
      message.error(`答案数据下载失败！${error}`)
    }
  }

  render() {
    const { paper_id, answers, isOwner, paper_name } = this.state
    return (
      <div className="answersBody">
        <Spin spinning={this.state.loading} tip="下载答案数据....">
          <Renamer paper_id={paper_id} paper_name={paper_name} isOwner={isOwner} />
          <AnswerProccesser data={answers} />
        </Spin>
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
