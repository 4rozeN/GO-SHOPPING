// 加入购物车的请求
import request from '@/utils/request'

// 添加商品到购物车
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  // goodsId: 商品id, goodsNum: 商品数量, goodsSkuId: 商品规格id 如红色手机
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 获取购物车列表
export const getCartList = () => {
  return request.get('/cart/list')
}

// 更新购物车商品
export const updateCart = (obj) => {
  const { goodsId, goodsNum, goodsSkuId } = obj
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}
