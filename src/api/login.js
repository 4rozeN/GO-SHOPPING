// 登录相关接口请求
import request from '@/utils/request'

export const getPicCode = () => {
  return request.get('/captcha/image')
}
