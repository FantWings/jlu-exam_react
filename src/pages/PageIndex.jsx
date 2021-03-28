import React, { useState } from 'react'
import { Input, message } from 'antd'
import { ConnectionState } from '../common/Context'
import styled from 'styled-components'
import { BASE_URL } from '../api'

export default function ComponentsFroms() {
  const [FromData, setFromData] = useState({
    data: undefined,
    token: undefined,
  })
  const { isAuthed } = ConnectionState
  const { TextArea } = Input

  return (
    <Form method="post" name="form">
      <TextArea
        showCount
        placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击菜单上的“使用教程”"
        autoSize={{ minRows: 20, maxRows: 20 }}
        onChange={(e) => setFromData({ ...FromData, data: e.target.value })}
        allowClear
      />
      <div id="key_feid">
        <h4>执行密钥</h4>
        <Input.Password
          placeholder={isAuthed ? '密钥处于有效期，无需重复输入' : '为了避免恶意请求，请输入执行密钥'}
          id="token"
          onChange={(e) => setFromData({ ...FromData, token: e.target.value })}
          disabled={isAuthed}
        />
        <p>
          <Submit data={FromData.data} token={FromData.token} />
        </p>
      </div>
    </Form>
  )
}

function Submit(data, token) {
  const [status, setStatus] = useState({
    status: 'ready',
    text: '提交',
  })

  function handleClick(e) {
    e.preventDefault()

    //判断用户是否输入了内容
    if (data.length !== 0) {
      message.loading({ content: '数据处理中，请稍等....', key: 'loading', duration: 0 })
      setStatus({ status: 'sending', text: '别着急' })
    } else {
      return message.warning('您忘了填写试卷数据！请检查！')
    }

    //判断用户是否输入的是垃圾数据
    try {
      var req = { question_data: JSON.parse(data), token: token }
    } catch (error) {
      message.warning({ content: '你输入的试卷数据不正确或试卷数据不完整，请检查！', key: 'loading' })
      return setStatus({ status: 'failure', text: '重试一次' })
    }

    const { answerPaperRecordId } = req.question_data.data
    try {
      fetch(`${BASE_URL}/paper/${answerPaperRecordId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(req),
      }).then((response) => {
        const { data, success, msg } = response.json()
        if (success) {
          setStatus({ status: 'success', text: '再次解析' })
          message.success('答案解析完成')
          // history.push(`/answer/${data}`)
        } else {
          //处理失败，报错，并让用户重试
          message.error({ content: msg, key: 'loading' })
          setStatus({ status: 'failure', text: '重试一次' })
        }
        //重定向用户浏览器视口到顶部
        window.scrollTo(0, 0)
        message.destroy('loading')
      })
    } catch (error) {
      //请求失败处理
      message.error({ content: `请求发送失败，${error}`, key: 'loading' })
      this.setState({ status: 'failure', text: '重试一次' })
    }
  }

  return (
    <button onClick={(e) => handleClick(e)} id="submit" className={status.status}>
      {status.text}
    </button>
  )
}

const Form = styled.form`
  text-align: center;
  margin-top: 35px;
  flex: 1;

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
    }

    &:active {
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
