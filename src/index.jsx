import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Router from './router'

//ReactRender入口函数
ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.querySelector('#root')
)
