import './styles.css'
import Froms from './pages/PageIndex'
import History from './pages/PageHistory'
import PageAnswer from './pages/PageAnswer'
import PageContainer from './pages'
import { Route, Switch, Redirect } from 'react-router'

export default function router() {
  //APP外壳函数
  return (
    <PageContainer>
      <Switch>
        <Route path="/" component={Froms} exact />
        <Route path="/history" component={History} exact />
        <Route path="/answer/:paper_id" component={PageAnswer} exact />
        <Redirect to="/" />
      </Switch>
    </PageContainer>
  )
}
