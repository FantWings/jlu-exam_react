import { useState, useEffect } from 'react'
import { message } from 'antd'

export const fetchData = async (url, config) => {
  try {
    const response = await fetch(url, config)
    const { ok, status } = response

    if (!ok) {
      switch (status) {
        case 400:
          message.error('请求包含语法错误或无法完成请求！')
          break
        case 404:
          message.error('请求的资源未找到！')
          break
        case 500:
          message.error('服务器错误，服务器在处理请求的过程中发生了错误')
          break
        default:
          message.error('未知错误，请求失败')
          break
      }
    } else {
      const { code, msg, data } = await response.json()
      if (code) {
        message.error(msg)
      } else {
        if (msg) message.success(msg)
      }
      return { code, msg, data }
    }
  } catch (error) {
    message.error(`接口请求失败，请检查网络连接，如果问题依然存在，请联系管理员！${error}`)
  }
}

export const useFetch = (url) => {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fn = async () => {
      setLoading(true)
      const { data } = await fetchData(url, { headers: { userIdent: localStorage.getItem('userIdent') } })
      setData(data)
      setLoading(false)
    }
    fn()
  }, [url])
  return [data, loading]
}

export default useFetch
