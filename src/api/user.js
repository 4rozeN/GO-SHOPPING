import request from '@/utils/request'

// 获取个人信息
export const getUserInfoDetail = () => {
  return request.get('/user/info')
}

// 上传图片
export const uploadAvatar = (file) => {
  return request.post('/upload/image', {
    file
  })
}
