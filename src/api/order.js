import request from '@/utils/request'

// 订单结算
// mode: cart(购物车结算) 可补全参数cartids和remark
// ifObj: buyNow(立即购买) 可补全参数goodsId, goodsNum, goodsSkuId,remark
export const checkOrder = (mode, ifObj) => {
  return request.post('/checkout/submit', {
    mode: mode, // buyNow：立即购买， cart: 购物车购买
    delivery: 10, // 物流方式
    couponId: 0, // 优惠券ID，暂时不用
    isUserPoints: 0, // 是否使用积分，1使用，0不使用
    payType: 10, // 支付方式 10:余额支付
    ...ifObj // 未传递的可选参数可用ifObj包装，动态展开
  })
}
