// 约定一个通用键名
const INFO_KEY = 'go_shopping_info'

export const getInfo = () => {
  const defaultInfo = {
    token: '',
    userId: ''
  }
  const info = localStorage.getItem(INFO_KEY)
  // 判断info是否有值
  return info ? JSON.parse(info) : defaultInfo
}

export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}
