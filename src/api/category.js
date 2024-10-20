import request from '@/utils/request'

// 获取分类数据
export const getCategoryDataAPI = () => {
  return request.get('/category/list')
}