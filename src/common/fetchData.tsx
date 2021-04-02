import { message } from 'antd'
/** Fetch封装
 * 接受传入参数：
 * url：请求地址
 * config：fetch高级配置
 *
 */
export const fetchData = async (url: string, config?: RequestInit | undefined) => {
  try {
    const res = await fetch(url, config)
    if (!res.ok) {
      message.error('请求失败，与服务器通讯失败！')
      return false
    }
    const { data, success, msg } = await res.json()
    if (success) {
      if (msg) message.success(msg)
      return data
    } else {
      message.error(msg)
    }
  } catch (error) {
    message.error({
      content: `请求失败，网络或服务器错误！${error}`,
      key: 'loading',
    })
  }
}
