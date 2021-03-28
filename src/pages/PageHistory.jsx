import React, { useState, useEffect } from 'react'
import { Pagination, message, Spin } from 'antd'
import { BASE_URL } from '../api'
import styled from 'styled-components'

export default function History() {
  const [state, setState] = useState({
    isLoading: false,
    data: undefined,
    total: 0,
  })

  useEffect(() => {
    setState({ isLoading: true })
    try {
      fetch(`${BASE_URL}/paper/lists`).then((response) => {
        setState({ data: response.json() })
      })
    } catch (error) {
      return message.error(`服务器错误，${error}`)
    }
    setState({ isLoading: false })
  }, [])

  function HandleChange(index, limit) {
    try {
      //设置页面为加载状态
      setState({ isLoading: true })
      //获取数据
      fetch(`${BASE_URL}/paper/lists?limit=${limit}&index=${index}`).then((response) => {
        const data = response.json()
        //使用数据更新组件状态
        setState({ isLoading: false, data: data.data, total: data.msg.total })
      })
    } catch (error) {
      //请求失败处理
      setState({ isLoading: false })
      return message.error(`数据获取失败，请重试！${error}`)
    }
  }

  return (
    <AnswerContain>
      <h1 className="q_type">答案库</h1>
      <small className="smallTitle">这里收集了所有同学有史以来提交过的试卷数据</small>
      <Spin spinning={state.isLoading} tip="向服务器请求数据...." className="loader">
        {/* <ListObject data={state.data}></ListObject> */}
      </Spin>
      <span id="pagination">
        <Pagination showSizeChanger defaultCurrent={1} total={state.total} onChange={HandleChange}></Pagination>
      </span>
    </AnswerContain>
  )
}

const AnswerContain = styled.div`
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
  span.historyPaperInfo {
    flex: 1;
    color: #333;
    h3 {
      margin: 0.2em 0;

      &#titled {
        color: #6191e6;
      }
    }
    span {
      margin: 0 5px;
      color: #909090;
    }
  }

  span.historyPaperUUID {
    color: #cacaca;
    font-size: smaller;
    @media screen and (max-width: 500px) {
      display: none;
    }
  }

  span#pagination {
    display: block;
    margin-top: 3em;
  }
  small.smallTitle {
    text-align: center;
    display: block;
    position: relative;
    bottom: 2em;
    color: #7b7b7b;
  }
`
