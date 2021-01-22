import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.htips.cn/jlu_helper/v1',
  timeout: 10000,
})
