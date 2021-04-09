import './styles.css'
import Froms from './pages/PageIndex'
import History from './pages/PageHistory'
import PageAnswer from './pages/PageAnswer'
import PageContainer from './pages'
import { Route } from 'react-router'

export default function router() {
  //APP外壳函数
  return (
    <PageContainer>
      <Route path="/history" component={History} strict={true} />
      <Route path="/" component={Froms} exact={true} />
      <Route path="/answer/:paper_id" component={PageAnswer} />
      {/* <Route path="/answer/:paper_id" component={AnswerBody} />
        <Route path="/(home|answer)" component={Forms} strict={true} /> */}
    </PageContainer>
  )
}
