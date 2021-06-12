import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

// ReactRender入口函数
ReactDOM.render(
  <BrowserRouter>
    <ConfigProvider locale={zhCN}>
      <Router />
    </ConfigProvider>
  </BrowserRouter>,
  document.querySelector('#root')
)
