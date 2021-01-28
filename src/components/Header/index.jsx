import State from './State'
import './index.css'

export default function Header() {
  return (
    <div id="title">
      <h2>吉林大学作业小助手</h2>
      <State />
      <small id="menu">
        <a href="/" rel="noopener noreferrer">
          返回主页
        </a>
        <a
          href="http://dec.jlu.edu.cn/learning/entity/student/student_toOuterSystem.action?key=homework"
          target="_blank"
          rel="noopener noreferrer"
        >
          作业管理
        </a>
        <span style={{ color: 'gray', margin: '0 5px' }}>提交历史</span>
        <a href="https://github.com/FantWings/jlu_homework_helper" target="_blank" rel="noopener noreferrer">
          需要帮助
        </a>
      </small>
    </div>
  )
}
