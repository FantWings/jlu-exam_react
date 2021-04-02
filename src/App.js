import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { notification } from 'antd'
import styled from 'styled-components'
import './styles.css'

import { ConnectionState } from './common/Context'
import Footer from './components/ComponentsFooter'
import Header from './components/ComponentsHeader'
import Froms from './pages/PageIndex'
import History from './pages/PageHistory'

import { BASE_URL } from './api'
import PageAnswer from './pages/PageAnswer'

export default function App() {
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

  //APP外壳函数
  return (
    <Container>
      <ConnectionState.Provider value={status}>
        <Header />
        <Route path="/history" component={History} strict={true} />
        <Route path="/" component={Froms} exact={true} />
        <Route path="/answer/:paper_id" component={PageAnswer} />
        {/* <Route path="/answer/:paper_id" component={AnswerBody} />
        <Route path="/(home|answer)" component={Forms} strict={true} /> */}
        <Footer />
      </ConnectionState.Provider>
    </Container>
  )
}

const Container = styled.div`
  margin: 40px auto;
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media screen and (min-width: 768px) {
    padding: 38px;
  }
  padding: 20px;
`
