import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Input, message } from 'antd'
import styled from 'styled-components'
import { BASE_URL } from '../api'

export default function PageForms() {
  const [FromData, setFromData] = useState(0)
  const [status, setStatus] = useState({
    status: 'ready',
    text: '提交',
  })

  const history = useHistory()
  const { TextArea } = Input

  const handleClick = async (e) => {
    e.preventDefault()

    //判断用户是否输入了内容
    if (FromData.length >= 10000) {
      message.loading('数据处理中，请稍等....')
      setStatus({ status: 'sending', text: '别着急' })
    } else {
      return message.warning('您没有填写试卷数据！请检查！')
    }

    //判断用户是否输入的是错误的数据
    try {
      var req = { question_data: JSON.parse(FromData) }
    } catch (error) {
      message.warning('你输入的试卷数据不正确或试卷数据不完整，请检查！')
      return setStatus({ status: 'failure', text: '重试一次' })
    }

    const { answerPaperRecordId } = req.question_data.data
    const response = await fetch(`${BASE_URL}/paper/${answerPaperRecordId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(req),
    })

    const { code, msg } = await response.json()
    message.destroy()

    if (code) {
      message.error(msg)
    } else {
      history.push(`/answer/${answerPaperRecordId}`)
      //重定向用户浏览器视口到顶部
      window.scrollTo(0, 0)
      if (msg) message.info(msg)
    }
  }

  return (
    <Form method="post" name="form">
      <TextArea
        showCount
        placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击菜单上的“使用教程”"
        autoSize={{ minRows: 20, maxRows: 20 }}
        onChange={(e) => setFromData(e.target.value)}
        allowClear
      />
      <div id="key_feid">
        <button onClick={(e) => handleClick(e, FromData)} id="submit" className={status.status}>
          {status.text}
        </button>
      </div>
    </Form>
  )
}

const Form = styled.form`
  text-align: center;
  margin-top: 35px;
  flex: 1;
  padding: 20px;

  #key_feid {
    margin: 35px 0 45px 0;
    p {
      margin: 45px 0;
    }
  }
  .ant-input-password {
    max-width: 480px;
  }
  #token {
    text-align: center;
  }

  #question_feid {
    box-sizing: border-box;
    resize: none;
    transition: 0.5s;
    width: 100%;
  }

  #form_contain {
    flex: 100%;
  }

  #submit {
    cursor: pointer;
    outline: none;
    border: 0;
    padding: 10px 80px;
    border-radius: 999em;
    background: #5882dd;
    color: #fff;
    margin: auto;
    transition: 0.3s;
    &:hover {
      background: #6596ff;
      transform: scale(1.02);
    }

    &:active {
      transform: scale(0.98);
      background: #4a6fbe;
    }
    &.sending {
      background: #b8ceff;
      cursor: not-allowed;
      pointer-events: none;
    }
    &.failure {
      background: #fa4e4e;
    }
    &.failure:hover {
      background: #ff8080;
    }
    &.failure:active {
      background: #ca6565;
    }
  }
`
