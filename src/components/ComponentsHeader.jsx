import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { ConnectionState } from '../common/Context'

export default function ComponentsHeader() {
  const { isLoading, isSuccess, count } = useContext(ConnectionState)

  return (
    <PageTitle>
      <h2>吉林大学作业小助手</h2>
      <p id="s_title">
        <small id="notice">
          你身边最牛逼的作业小助手，
          {isLoading
            ? '统计数据加载中'
            : isSuccess
            ? count
              ? `累计已处理 ${count} 张试卷`
              : '使用统计功能未启用'
            : '获取统计数据失败'}
        </small>
      </p>
      <small id="menu">
        <Link to="/">主页</Link>
        <a
          href="http://dec.jlu.edu.cn/learning/entity/student/student_toOuterSystem.action?key=homework"
          target="_blank"
          rel="noopener noreferrer"
        >
          作业管理
        </a>
        <Link to="/history">答案库</Link>
        <a href="https://github.com/FantWings/jlu_homework_helper" target="_blank" rel="noopener noreferrer">
          使用教程
        </a>
      </small>
    </PageTitle>
  )
}

const PageTitle = styled.div`
  text-align: center;
  flex: 100%;

  #s_title {
    position: relative;
    bottom: 10px;
    color: #a0a0a0;
    margin: 0;
    small {
      span {
        color: orange;
      }
    }
  }

  #menu {
    margin-top: 5px;
    a {
      margin: 0 5px;
    }
  }
`
