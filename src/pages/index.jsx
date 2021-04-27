import React, { useState, useEffect } from 'react'
import { Spin, notification } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BASE_URL } from '../api'

export default function PageContianer(props) {
  const [status, setStatus] = useState({
    isLoading: true,
    isSuccess: false,
    count: false,
    authed: false,
  })

  useEffect(() => {
    setStatus({ isLoading: true })
    fetch(`${BASE_URL}/getState`, {
      credentials: 'include',
      mode: 'cors',
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setStatus({ isLoading: false, isSuccess: true, count: data.count, authed: data.authed })
        })
      } else {
        setStatus({ isSuccess: false, isLoading: false })
        notification.error({
          message: '服务器通讯失败',
          description:
            '这种情况往往是网络连接失败，或者服务器出现了问题，如果问题依然存在，请与开发者取得联系，此工具的功能将无法正常运作。',
          duration: 0,
        })
      }
    })
  }, [])

  return (
    <Container>
      <Spin spinning={status.isLoading} tip="工具初始化">
        <PageTitle>
          <h2>吉林大学作业小助手</h2>
          <p id="s_title">
            <small id="notice">
              你身边最牛逼的作业小助手，
              {status.isLoading
                ? '统计数据加载中'
                : status.isSuccess
                ? status.count
                  ? `累计已处理 ${status.count} 张试卷`
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
        {props.children}
        <Footer>
          <ul>
            <li>
              版本 version 4.5r（<a href="https://reactjs.org">ReactJS</a>）
            </li>
            <li>
              <span id={status.isSuccess ? 'connected' : 'disconnected'} className="ping" />
              {status.isSuccess ? '服务器通讯已建立' : '与服务器通讯失败'}
            </li>
            <li>适用于 吉林大学弘成科技发展有限公司 学生作业系统</li>
            <li>
              源代码：<a href="https://github.com/FantWings/jlu_homework_helper">GitHub</a>
            </li>
          </ul>
        </Footer>
      </Spin>
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  margin: auto;
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media screen and (min-width: 768px) {
    padding: 38px;
  }
  /* padding: 20px; */
`

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

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #222d44;
  z-index: 2;
  ul {
    list-style: none;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 1em;
    @media screen and (max-width: 1000px) {
      li:nth-child(3) {
        display: none;
      }
    }
    @media screen and (max-width: 500px) {
      li:nth-child(4) {
        display: none;
      }
    }
    li {
      margin: 0 8px;
      color: #fff;
      font-size: 0.8em;
      span {
        &.ping::before {
          content: '●';
          font-size: larger;
          margin-right: 4px;
          transition: 0.5s;
        }

        &#disconnected {
          &::before {
            color: #fa4e4e;
          }
        }

        &#connected {
          &::before {
            color: #87f76b;
          }
        }
      }
    }
  }
`
