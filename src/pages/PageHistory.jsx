import React, { useState, useEffect } from 'react'
import { Pagination, Spin } from 'antd'
import { BASE_URL } from '../api'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import { fetchData } from '../common/fetchData'

export default function History() {
  const [data, setData] = useState({
    data: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState([1, 10])

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      setData(await fetchData(`${BASE_URL}/paper/lists?limit=${pagination[1]}&index=${pagination[0]}`))
      setIsLoading(false)
    }
    getData()
  }, [pagination])

  function HandleChange(index, limit) {
    setPagination([index, limit])
  }

  return (
    <AnswerContain key="animContent">
      <h1 className="q_type">答案库</h1>
      <small className="smallTitle">这里收集了所有同学有史以来提交过的试卷数据</small>
      <Spin spinning={isLoading} tip="向服务器请求数据...." className="loader">
        <ListObject data={data.results} />
      </Spin>
      <span id="pagination">
        <Pagination showSizeChanger defaultCurrent={1} total={data.total} onChange={HandleChange}></Pagination>
      </span>
    </AnswerContain>
  )
}

function ListObject(data) {
  const history = useHistory()
  function handleClick(uuid) {
    history.push(`/answer/${uuid}`)
  }
  if (data.data) {
    return data.data.map((data) => {
      return (
        <div className="answer_block" key={data[0]} onClick={() => handleClick(data[0])}>
          <span className="historyPaperInfo">
            {data[1] != null ? <h3 id="titled">《 {data[1]} 》</h3> : <h3 id="untitled">《 无名试卷 》</h3>}
            <span>{data[2]}</span>
          </span>
          <span className="historyPaperUUID">{data[0]}</span>
        </div>
      )
    })
  }
  return null
}

const AnswerContain = styled.div`
  @media screen and (max-width: 500px) {
    padding: 32px 12px;
  }
  padding: 32px;
  box-shadow: 0px 0px 35px rgb(231, 231, 239);
  margin: 40px auto;
  flex: 100%;
  .q_type {
    text-align: center;
    margin: 10px 0 30px 0;
  }
  #selected {
    border: 1px solid rgb(141, 142, 255);
    background-color: #f8f8ff;
  }
  span.historyPaperInfo {
    flex: 1;
    color: #333;
    h3 {
      margin: 0.2em 0;

      &#titled {
        color: #6191e6;
      }
    }
    span {
      margin: 0 5px;
      color: #909090;
    }
  }

  span.historyPaperUUID {
    color: #cacaca;
    font-size: smaller;
    @media screen and (max-width: 500px) {
      display: none;
    }
  }

  span#pagination {
    display: block;
    margin-top: 3em;
  }
  small.smallTitle {
    text-align: center;
    display: block;
    position: relative;
    bottom: 2em;
    color: #7b7b7b;
  }
  .answer_block {
    display: flex;
    margin: 10px 5px;
    padding: 10px 8px;
    border: 1px solid rgb(238, 238, 238);
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      border: 1px solid rgb(141, 142, 255);
      transform: scale(1.02);
      box-shadow: 0px 0px 5px rgb(216, 216, 255);
    }
    &:active {
      transform: scale(0.98);
    }
  }
`
