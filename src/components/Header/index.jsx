import React from 'react'
import { Link } from 'react-router-dom'

import State from './State'
import './index.css'

export default function Header() {
  return (
    <div id="title">
      <h2>吉林大学作业小助手</h2>
      <State />
      <small id="menu">
        <Link to="/home">主页</Link>
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
    </div>
  )
}
