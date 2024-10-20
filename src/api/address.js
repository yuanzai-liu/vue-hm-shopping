import request from '@/utils/request'

// 获取地址列表
export const getAddressListAPI = () => {
  return request.get('/address/list')
}