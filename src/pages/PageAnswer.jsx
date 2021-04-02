import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'
import { BASE_URL } from '../api'
import styled from 'styled-components'
import { fetchData } from '../common/fetchData'

export default function PageAnswer() {
  const [data, setData] = useState({
    paper_id: undefined,
    submit_time: undefined,
    isOwner: undefined,
    answers: [],
    paper_name: undefined,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [paperName, setPaperName] = useState(undefined)

  const { paper_id } = useParams()

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      setData(await fetchData(`${BASE_URL}/paper/${paper_id}`))
      setIsLoading(false)
    }
    getData()
  }, [paper_id])

  const renamePaper = async () => {
    if (paperName.length >= 4) {
      setIsLoading(true)
      setData(
        await fetchData(`${BASE_URL}/paper/setPaperName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({ paper_id: data.paper_id, new_name: paperName }),
        })
      )
      setIsLoading(false)
    }
  }

  console.log(data)
  return (
    <AnswersBody>
      <span id="notices" className="bar error">
        <p>本工具仅供交流学习用途！任何因本工具导致的问题将不会为你付任何责任！</p>
        <small id="info">
          试卷号（UUID）：{data.paper_id} 丨 提交时间：{data.submit_time}
        </small>
      </span>
      <span id="paper_name">
        <h2>
          《
          <input
            type="text"
            placeholder={
              data.paper_name ? data.paper_name : data.isOwner ? '点此处给这个试卷命名' : '没有试卷名称修改权限'
            }
            onChange={(e) => setPaperName(e.target.value)}
            onBlur={renamePaper}
            disabled={!data.isOwner}
          />
          》
        </h2>
      </span>
      <span className="liner" key="liner_head">
        <span className="liner_text">标准答案</span>
      </span>
      <Spin spinning={isLoading} tip="下载答案数据....">
        <AnswerProccesser data={data.answers} />
      </Spin>
      {/* <span className="liner" key="liner_foot">
        <span className="liner_text">再次解析</span>
      </span> */}
    </AnswersBody>
  )
}

function AnswerProccesser(props) {
  let rows = []
  for (const key in props.data) {
    if (Object.keys(props.data[key].answer).length > 0) {
      rows.push(<AnswerBlock answer_data={props.data[key]} type_id={key} key={key} />)
    }
  }
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
    return <AnswerRow data={data} key={data.uuid} />
  })
}

function AnswerRow(data) {
  const [isSelected, setIsSelected] = useState(false)
  return (
    <div className="answer_block" id={isSelected ? 'selected' : ''} onClick={() => setIsSelected(!isSelected)}>
      <span className={'answer'}>{data.data.answer}</span>
      <div>
        <span className="q_id">
          <small id="question_id">{data.data.question_id}</small>
          <small id="question_type">{data.data.question_type}</small>
        </span>
        <span className="question">{data.data.question}</span>
      </div>
    </div>
  )
}

const AnswersBody = styled.div`
  flex: 100% 1;
  .liner {
    border-bottom: #eaeaea 2px dashed;
    display: block;
    margin-bottom: 2em;
  }
  .liner_text {
    display: block;
    background-color: #f9f9fb;
    padding: 6px 6px 6px 18px;
    color: #aeaeae;
    position: relative;
    width: 160px;
    text-align: center;
    top: 17px;
    letter-spacing: 16px;
    margin: auto;
  }
  .answer_contain {
    @media screen and (max-width: 500px) {
      padding: 32px 12px;
    }
    padding: 32px;
    box-shadow: 0px 0px 35px rgb(231, 231, 239);
    margin: 40px auto;
    flex: 100%;
    .q_type {
      text-align: center;
      margin: 10px 0 30px 0;
    }
    #selected {
      border: 2px solid rgb(141, 142, 255);
      background-color: #f8f8ff;
    }
  }

  .answer_block {
    display: flex;
    margin: 10px 5px;
    padding: 10px 8px;
    border: 2px solid rgb(238, 238, 238);
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      border: 2px solid rgb(141, 142, 255);
    }
    .q_id {
      margin: 0;
      display: block;
      margin-bottom: 4px;
      #question_type {
        color: #9fa6bf;
      }
      #question_id {
        color: #638eeb;
        margin-right: 4px;
      }
    }
    .question {
      color: #6d758d;
      font-size: small;
    }
    .answer {
      margin: auto;
      font-size: 30px;
      margin: auto 20px;
      color: #2b2d38;
    }
    .multi {
      font-size: 20px;
      margin: auto 15px;
      min-width: 70px;
    }
  }

  .last {
    margin-bottom: 40px;
  }

  .last:last-child {
    margin-bottom: 10px;
  }
  .bar {
    flex: 100%;
    display: block;
    color: #f9f9fb;
    margin: 30px 0 0;
    padding: 20px;
    transition: 0.5s;
    h3 {
      margin: 0;
    }
    p {
      margin-top: 0;
      font-size: 18px;
    }
    &.error {
      background: rgb(250, 78, 78);
      box-shadow: 8px 0px 20px rgba(187, 0, 0, 0.16);
    }
    &.info {
      background: #638eeb;
      box-shadow: 8px 0px 20px rgba(0, 65, 187, 0.16);
    }
    &#notices {
      flex: 100%;
      margin: 30px 0 0;
      padding: 20px;
      color: #f9f9fb;
      background: rgb(250, 78, 78);
      text-align: center;
      transition: 1s;
      p {
        margin-top: 0;
        font-size: 18px;
      }
    }
  }
  #paper_name {
    display: flex;
    text-align: center;
    margin-top: 3em;
    justify-content: center;
    h2 {
      flex: 1;
    }
    input {
      margin: 0 0.5em;
      width: 30%;
      min-width: 250px;
      border: none;
      background-color: #ffffff00;
      // border-bottom: 1px rgb(190, 190, 190) dotted;
      text-align: center;
      &:focus {
        outline: none;
      }
    }
  }
`
