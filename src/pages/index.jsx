import { Spin } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import useFetch from '../hooks/useFetch'
import useIdenCheck from '../hooks/useUserIdent'

import { BASE_URL } from '../config'

export default function PageContianer(props) {
  const [data, loading] = useFetch(`${BASE_URL}/getState`)
  useIdenCheck()

  return (
    <Container>
      <Spin spinning={loading} tip="工具初始化">
        <PageTitle>
          <h2>吉林大学作业小助手</h2>
          <p id="s_title">
            <small id="notice">
              你身边最牛逼的作业小助手，
              {loading ? (
                '统计数据加载中'
              ) : data.count ? (
                <span>
                  累计已处理 <Counter>{data.count}</Counter> 张试卷
                </span>
              ) : (
                '由于后端错误，获取统计数据失败'
              )}
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
              版本 version 5.2（<a href="https://reactjs.org">ReactJS</a>）
            </li>
            <li>
              <span id={data.count ? 'connected' : 'disconnected'} className="ping" />
              {data.count ? '服务器通讯已建立' : '与服务器通讯失败'}
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
  padding: 20px;
`

const PageTitle = styled.div`
  text-align: center;
  flex: 100%;

  #s_title {
    position: relative;
    bottom: 10px;
    color: #a0a0a0;
    margin: 0;
  }

  #menu {
    margin-top: 5px;
    a {
      margin: 0 5px;
    }
  }
`

const Counter = styled.span`
  color: orange;
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
