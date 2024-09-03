import request from '@/utils/request'

// 提交订单确认
// mode: cart(购物车结算) 可补全参数cartIds
// ifObj: buyNow(立即购买) 可补全参数goodsId, goodsNum, goodsSkuId,remark
export const checkOrder = (mode, ifObj) => {
  // console.log('api接收参数mode:', mode)
  // console.log('api接收参数ifObj:', ifObj)
  const tfkObj = {
    mode: mode, // buyNow：立即购买， cart: 购物车购买
    delivery: 10, // 物流方式
    shopId: 0, // 自提门店id
    couponId: 0, // 优惠券ID，暂时不用
    isUserPoints: 0, // 是否使用积分，1使用，0不使用
    ...ifObj // 未传递的可选参数可用ifObj包装，动态展开
  }
  // console.log('api发送参数tfkObj:', tfkObj)
  return request.get('/checkout/order', {
    params: tfkObj
  })
}

// 结算订单
// mode: cart(购物车结算) 可补全参数cartIds
// ifObj: buyNow(立即购买) 可补全参数goodsId, goodsNum, goodsSkuId
export const submitOrder = (mode, dataObj) => {
  const tfkObj = {
    mode: mode, // buyNow：立即购买， cart: 购物车购买
    delivery: 10, // 物流方式
    couponId: 0, // 优惠券ID，暂时不用
    isUserPoints: 0, // 是否使用积分，1使用，0不使用
    payType: 10, // 余额支付
    ...dataObj // 未传递的可选参数可用dataObj包装，动态展开
  }
  return request.post('/checkout/submit', tfkObj)
}

// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}

// 获取订单详情
export const getOrderDetail = (orderId) => {
  return request.get('/order/detail', {
    params: {
      orderId: orderId
    }
  })
}

// 取消订单
export const cancelOrder = (orderId) => {
  return request.post('/order/cancel', {
    orderId: orderId
  })
}

// 支付未支付的订单
export const payOrder = (orderId, payType) => {
  return request.get('/order/pay', {
    query: {
      orderId: orderId,
      payType: payType // 支付方式，10：余额支付，20：微信支付
    }
  })
}

// 订单确认收货
export const receiptOrder = (orderId) => {
  return request.post('/order/receipt', {
    orderId: orderId
  })
}

// 提交商品评价
export const submitComment = (dataObj) => {
  return request.post('/order.comment/submit', {
    orderId: dataObj.orderId,
    form: dataObj.form
  })
}

// 已评价的商品列表
export const getCommentList = (orderId) => {
  return request.get('/order.comment/list', {
    query: {
      orderId: orderId
    }
  })
}

// 申请售后
export const refundGoods = (dataObj) => {
  return request.post('/refund/goods', {
    orderGoodsId: dataObj.orderGoodsId,
    form: dataObj.form
  })
}
