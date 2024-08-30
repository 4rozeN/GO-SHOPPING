import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: { platform: 'h5' }
})

// 自定义配置 - 请求/响应 拦截器 （如果希望不污染原本的axios需要将axios改为instance实例）
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 发送请求时显示Toast提示，背景不可点击
  Toast.loading({
    message: '加载中...',
    forbidClick: true, // 禁止背景点击
    duration: 0 // 值为0时，toast不会自动关闭
  })

  // 只要有token就在请求中携带，便于请求需要权限的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'h5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 (默认axios会对响应多包装一层data，所以这里需要取出data)
  const res = response.data
  if (res.status !== 200) {
    Toast(res.message)
    return Promise.reject(res.message)
  } else {
    // 关闭Toast提示
    Toast.clear()
  }
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response) {
    // 服务器返回了错误响应
    Toast(`服务器错误: ${error.response.data.status}`) // 上限时注释掉
    // Toast(`服务器错误`) // 上线时开启注释
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    Toast('请求超时或网络错误')
  } else {
    // 其他错误
    Toast('请求配置错误')
  }
  return Promise.reject(error)
})

// 导出配置好的示例
export default instance
