import { Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Forms from './components/Forms'
import Bars from './components/Bars'
import AnswerBody from './pages/Answers'
import './styles.css'

export default function App() {
  console.log(
    `
    +--------------------------------+
    |   Build with ReactJS v17.0.1   |
    +--------------------------------+

    嗨！你发现了我的小秘密！
    其实我也不知道为什么当初会有这样的想法冒着可能被开除的风险去写这个奇葩的工具，
    很幸运的是，风险与收益往往并存，这个工具被同学甚至老师们们广泛使用开来了。
    这个工具的诞生某种程度上减少了老师去找答案给学生，学生省得在老师提供的答案中翻找的烦恼吧？
    不过你想想上面的师生操作，其实这个毕业证水分太大了。

    老师为了高毕业率，赚取更多提成，给学生提供答案
    学生为了顺利毕业，不去钻研知识，只想着去抄答案
    
    这真的是几年前的你所向往的结局吗？

    一句建议，保持学习精神，主动探索新知识，多动手去试，就像我写这个工具
    从一无所知，到Python数据处理，到Flask前后混合，再到现在的ReactJS前后分离。
    中途不知道经历了多少挫折，这个工具就是我努力学习和实践的结晶。
    
    这毕业证就是垃圾，和花钱买来的没什么区别。
    社会认可度非常低，如果你有凭着这个毕业证找工作的想法，建议还是报考学位吧。

    QQ:1330440011 欢迎探讨，让我们一起进步！

     - 终生学习，学无止境 -
     
    `
  )

  return (
    <div className="container">
      <Header />
      <Bars />
      <Route path="/answer/:paper_id" component={AnswerBody} />
      {/* <Route path="/" component={Forms} /> */}
      <Forms />
      <Footer />
    </div>
  )
}
