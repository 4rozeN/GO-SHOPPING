import request from '@/utils/request'

// 提交订单确认
// mode: cart(购物车结算) 可补全参数cartIds
// ifObj: buyNow(立即购买) 可补全参数goodsId, goodsNum, goodsSkuId,remark
export const checkOrder = (mode, ifObj) => {
  console.log('api接收参数mode:', mode)
  console.log('api接收参数ifObj:', ifObj)
  return request.get('/checkout/order', {
    mode: mode, // buyNow：立即购买， cart: 购物车购买
    delivery: 10, // 物流方式
    shopId: 0, // 自提门店id
    couponId: 0, // 优惠券ID，暂时不用
    isUserPoints: 0, // 是否使用积分，1使用，0不使用
    ...ifObj // 未传递的可选参数可用ifObj包装，动态展开
  })
}
