import { useState, useEffect } from 'react'

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}

const useIdenCheck = () => {
  const [userIdent, setUserIdent] = useState(localStorage.getItem('userIdent'))

  useEffect(() => {
    if (!userIdent) {
      const ident = guid()
      localStorage.setItem('userIdent', ident)
      setUserIdent(ident)
      console.log(
        '临时ID已分配：[',
        ident,
        ']，该身份ID用于识别试卷所有者，清除浏览器缓存可能会使你不能再修改试卷数据。'
      )
    } else {
      console.log(
        '使用已有的ID：[',
        userIdent,
        ']，该身份ID用于识别试卷所有者，清除浏览器缓存可能会使你不能再修改试卷数据。'
      )
    }
  }, [userIdent])
}

export default useIdenCheck
