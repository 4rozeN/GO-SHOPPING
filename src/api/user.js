import request from '@/utils/request'

// 获取个人信息
export const getUserInfoDetail = () => {
  return request.get('/user/info')
}

// 上传图片
export const uploadImage = (formData) => {
  // // 创建一个 FormData 对象
  // const formData = new FormData()
  // // 将文件对象添加到对象中
  // formData.append('file', file)
  // console.log('图片文件对象：', formData)
  // console.log('FormData数据：', formData.get('file'))
  // 发送请求
  return request.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
