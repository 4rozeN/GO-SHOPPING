// 登录相关接口请求
import request from '@/utils/request'

export const getPicCode = () => {
  return request.get('/captcha/image')
}

export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}
