import request from '@/utils/request'

export const getProductAPI = (obj) => {
  const { categoryId, goodsName, page} = obj
  return request.get('/goods/list',{
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}

// 获取商品详情数据
export const getProDetailAPI = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取商品评价
export const getProCommentsAPI = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}