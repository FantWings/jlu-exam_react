import { useState } from 'react'
import { useHistory } from 'react-router'
import { Input, message, Button } from 'antd'
import styled from 'styled-components'
import { BASE_URL } from '../config'
import { fetchData } from '../hooks/useFetch'

export default function PageForms() {
  const [FromData, setFromData] = useState(0)
  const [blindClick, setBlindClick] = useState(0)
  const [buttomStatus, setButtomStatus] = useState({
    failure: false,
    loading: false,
    text: '提交',
  })

  const history = useHistory()
  const { TextArea } = Input

  const handleClick = async (e) => {
    e.preventDefault()
    setButtomStatus({ ...buttomStatus, loading: true, text: '请稍等' })

    if (!FromData) {
      message.warn(blindClick >= 5 ? '嘿！别闹了，不填数据就点提交是行不通的！' : '提交的数据不可为空，请填写后重试')
      if (blindClick === 10) {
        message.error({ content: '....别按了！喝口茶冷静下！', duration: 0 })
      }

      setBlindClick(blindClick + 1)
      return setButtomStatus({
        ...buttomStatus,
        failure: true,
        loading: false,
        text: '重试一次',
      })
    }

    //判断用户是否输入的是错误的数据
    try {
      var req = { question_data: JSON.parse(FromData) }
    } catch (error) {
      message.warning('你输入的数据不正确或不完整，请检查后重新提交')
      return setButtomStatus({ ...buttomStatus, failure: true, loading: false, text: '重试一次' })
    }

    const { answerPaperRecordId } = req.question_data.data
    const { code } = await fetchData(`${BASE_URL}/paper/${answerPaperRecordId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        userIdent: localStorage.getItem('userIdent'),
      },
      body: JSON.stringify(req),
    })

    if (code) {
      return setButtomStatus({ ...buttomStatus, failure: true, loading: false, text: '重试一次' })
    } else {
      history.push(`/answer/${answerPaperRecordId}`)
      //重定向用户浏览器视口到顶部
      window.scrollTo(0, 0)
    }
  }

  return (
    <Form method="post" name="form">
      <TextArea
        showCount
        placeholder={
          blindClick >= 11
            ? '你是真的牛逼！'
            : '将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击菜单上的“使用教程”'
        }
        autoSize={{ minRows: 20, maxRows: 20 }}
        onChange={(e) => setFromData(e.target.value)}
        allowClear
      />
      <div id="key_feid">
        <Button
          onClick={(e) => handleClick(e, FromData)}
          type="primary"
          shape="round"
          size="large"
          style={{ padding: '0 80px' }}
          danger={buttomStatus.failure}
          loading={buttomStatus.loading}
          disabled={blindClick >= 11 ? true : false}
        >
          {buttomStatus.text}
        </Button>
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
`
