import request from '@/utils/request'

// 获取个人信息
export const getUserInfoDetailAPI = () => {
  return request.get('/user/info')
}