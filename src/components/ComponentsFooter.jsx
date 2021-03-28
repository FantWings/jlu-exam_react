import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BASE_URL } from '../api'

export default function ComponentsFooter() {
  const [status, setStatus] = useState({
    isConnected: true,
  })

  useEffect(() => {
    fetch(`${BASE_URL}/getState`).then((response) => {
      if (response.ok) {
        setStatus({ isConnected: true })
      } else {
        setStatus({ isConnected: false })
      }
    })
  }, [])

  return (
    <Footer>
      <ul>
        <li>
          版本 version 4.1c（<a href="https://reactjs.org">ReactJS</a>）
        </li>
        <li>
          <span id={status.isConnected ? 'connected' : 'disconnected'} className="ping"></span>
          {status.isConnected ? '服务器通讯已建立' : '与服务器通讯失败'}
        </li>
        <li>适用于 吉林大学弘成科技发展有限公司 学生作业系统</li>
        <li>
          源代码：<a href="https://github.com/FantWings/jlu_homework_helper">GitHub</a>
        </li>
      </ul>
    </Footer>
  )
}

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #222d44;
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
