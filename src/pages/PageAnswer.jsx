import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { message, Divider, Skeleton, Switch } from 'antd'
import { BASE_URL } from '../config'
import styled from 'styled-components'
import { useFetch, fetchData } from '../hooks/useFetch'
import moment from 'moment'

export default function PageAnswer() {
  const { paper_id } = useParams()
  const [paperName, setPaperName] = useState(0)
  const [showOptions, setShowOptions] = useState(true)
  const [data, loading] = useFetch(`${BASE_URL}/paper/${paper_id}`)

  const renamePaper = async () => {
    message.loading({ content: '正在重命名试卷...', key: 'info_length' })
    if (paperName.length >= 4) {
      await fetchData(`${BASE_URL}/paper/setPaperName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userIdent: localStorage.getItem('userIdent'),
        },
        body: JSON.stringify({ paper_id: data.paper_id, new_name: paperName }),
      })
      message.destroy('info_length')
    } else {
      message.info({ content: '试卷名称需要大于4个字符', key: 'info_length', duration: 1 })
    }
  }

  return (
    <AnswersBody>
      <span id="notices" className="bar error">
        <p>本工具仅供交流学习用途！任何因本工具导致的问题将不会为你付任何责任！</p>
        <small id="info">
          试卷号（UUID）：{data.paper_id} 丨 提交时间：{moment(data.submit_time).format('YYYY-MM-DD HH:mm:ss')}
        </small>
      </span>
      <span id="paper_name">
        <h2>
          《
          <input
            type="text"
            placeholder={data.paper_name ? data.paper_name : data.isOwner ? '点此处命名试卷' : '您无法修改该试卷的名称'}
            onChange={(e) => setPaperName(e.target.value)}
            onBlur={renamePaper}
            disabled={!data.isOwner}
            maxLength={12}
          />
          》
        </h2>
      </span>
      <span id="optionDisplayControl">
        <span id="switchText">题目选项显示</span>
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          defaultChecked
          onChange={() => setShowOptions(!showOptions)}
        />
      </span>
      <Divider dashed style={{ color: '#bfbfbf' }}>
        标准答案
      </Divider>
      {loading ? <Skeleton active /> : undefined}
      {data ? (
        <>
          <AnswerContain source={data.answers.单选} title="单选题" showOptions={showOptions} />
          <AnswerContain source={data.answers.多选} title="多选题" showOptions={showOptions} />
          <AnswerContain source={data.answers.判断} title="判断题" showOptions={showOptions} />
          <AnswerContain source={data.answers.完形填空} title="完形填空" showOptions={showOptions} />
        </>
      ) : undefined}
    </AnswersBody>
  )
}

function AnswerContain(props) {
  const { source, title, showOptions } = props
  const rows = []

  if (!source) return null

  rows.push(
    <div className="answer_contain" key={title}>
      <h3 className="q_type">{title}</h3>
      {source.map((item, index) => (
        <Answer
          answer={item.answer}
          num={`第${index + 1}题`}
          type={item.type}
          question={item.question}
          options={item.options}
          key={item.id}
          showOptions={showOptions}
        />
      ))}
    </div>
  )
  return rows
}

function Answer(props) {
  const { answer, num, type, question, options, showOptions } = props
  const [isSelected, setIsSelected] = useState(false)
  const char = ['A', 'B', 'C', 'D', 'E', 'F']
  const judge = ['NULL', '对', '错']

  return (
    <div className="answer_block" id={isSelected ? 'selected' : undefined} onClick={() => setIsSelected(!isSelected)}>
      <span className={'answer'}>
        {type === '单选'
          ? char[answer.id]
          : type === '判断'
          ? judge[answer.id]
          : answer.idList.map((item) => char[item])}
      </span>
      <div style={{ flex: 1 }}>
        <span className="q_id">
          <small id="question_id">{num}</small>
          <small id="question_type">{type}</small>
        </span>
        <span className="question">{question}</span>
        <div
          style={{
            overflow: 'hidden',
            maxHeight: showOptions ? 150 : 0,
            transition: '0.8s cubic-bezier(0.39, 0.58, 0.57, 1)',
          }}
        >
          <Divider dashed style={{ margin: '8px 0' }}></Divider>
          <div className="options">
            {options.map((items, index) => (
              <span id={isRightAnswer(type, answer, index)} key={index}>
                {char[index]}.{items}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function isRightAnswer(answerType, answer, index) {
  if (answerType === '单选') {
    if (Number(answer.id) === index) return 'rightAnswer'
  }
  if (answerType === '判断') {
    if (Number(answer.id) - 1 === index) return 'rightAnswer'
  }
  if (answerType === '多选') {
    for (var i = 0; i < answer.idList.length; i++) if (Number(answer.idList[i]) === index) return 'rightAnswer'
  }
}

const AnswersBody = styled.div`
  flex: 100% 1;
  margin: 0 0 90px 0;

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
      font-size: 18px;
    }
    #selected {
      border: 1px solid rgb(141, 142, 255);
      background-color: #f8f8ff;
    }
  }

  .answer_block {
    display: flex;
    margin: 10px 5px;
    padding: 10px 8px;
    border: 1px solid rgb(238, 238, 238);
    border-radius: 5px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      border: 1px solid rgb(141, 142, 255);
      transform: scale(1.02);
      box-shadow: 0px 0px 5px rgb(216, 216, 255);
    }

    &:active {
      transform: scale(0.98);
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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .options {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      margin-top: 8px;
      * {
        /* margin-right: 12px; */
        color: #e2e0e0;
        flex: 1 50%;
        font-size: 12px;
        line-height: 26px;
        @media screen and (max-width: 500px) {
          flex: 1 100%;
        }
      }
      #rightAnswer {
        color: #828cc5;
      }
    }
    .answer {
      margin: auto;
      font-size: 30px;
      margin: auto 20px;
      color: #2b2d38;
      text-align: center;
      overflow-wrap: break-word;
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

  #optionDisplayControl {
    display: flex;
    justify-content: center;
    padding: 12px;

    #switchText {
      font-weight: 700;
      margin-right: 16px;
    }
  }

  #CompletedCounter {
    position: fixed;
    bottom: 80px;
    right: 25px;
  }
`
