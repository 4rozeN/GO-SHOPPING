import request from '@/utils/request'

// 获取商品详情
export const getGoodsDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取商品评价详情
export const getGoodsCommentDetail = (obj) => {
  const { scoreType, goodsId, page } = obj
  return request.get('/comment/list', {
    params: {
      scoreType,
      goodsId,
      page
    }
  })
}
