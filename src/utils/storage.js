// 约定一个通用键名
const INFO_KEY = 'go_shopping_info'
const HISTORY_KEY = 'shopping_history_info'

// 获取用户权证信息
export const getInfo = () => {
  const defaultInfo = {
    token: '',
    userId: ''
  }
  const info = localStorage.getItem(INFO_KEY)
  // 判断info是否有值
  return info ? JSON.parse(info) : defaultInfo
}

// 设置用户权证信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 删除用户权证信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY)
  return history ? JSON.parse(history) : []
}
// 设置搜索历史
export const setHistory = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}
