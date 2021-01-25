import State from './State'
import './index.css'

export default function Title() {
  return (
    <div id="title">
      <h2>吉林大学作业小助手</h2>
      <State />
      <small id="menu">
        <a href="https://github.com/FantWings/jlu_homework_helper" target="_blank" rel="noopener noreferrer">
          需要帮助
        </a>
        <a
          href="http://dec.jlu.edu.cn/learning/entity/student/student_toOuterSystem.action?key=homework"
          target="_blank"
          rel="noopener noreferrer"
        >
          作业管理
        </a>
      </small>
    </div>
  )
}
