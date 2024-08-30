import request from '@/utils/request'

// 获取分类页数据
export const getCategoryData = () => {
  return request.get('/category/list')
}
