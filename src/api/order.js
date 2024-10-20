import request from '@/utils/request'

export const checkOrderAPI = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode,
      delivery: 10, //10快递配送 20门店自提
      couponId: 0,  //优惠券ID， 传0 表示不使用优惠券
      isUsePoints: 0,   //积分 传0，不使用积分
      ...obj
    }
  })
} 

// 提交订单
export const submitOrderAPI = (mode, params) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 物流方式  配送方式 (10快递配送 20门店自提)
    couponId: 0, // 优惠券 id
    payType: 0, // 余额支付
    isUsePoints: 0, // 是否使用积分
    ...params
  })
}

// 订单列表
export const getMyOrderListAPI = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}