import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'

class ListObject extends Component {
  handleClick(uuid) {
    console.log(this.props)
    this.props.history.push(`/answer/${uuid}`)
  }

  render() {
    const { data } = this.props
    let rows = []
    for (const key in data) {
      rows.push(
        <div className="answer_block" key={data[key][0]} onClick={() => this.handleClick(data[key][0])}>
          <span className="historyPaperInfo">
            {data[key][1] != null ? <h3 id="titled">《 {data[key][1]} 》</h3> : <h3 id="untitled">《 无名试卷 》</h3>}
            <span>{data[key][2]}</span>
          </span>
          <span className="historyPaperUUID">{data[key][0]}</span>
        </div>
      )
    }
    return rows
  }
}

export default withRouter(ListObject)
