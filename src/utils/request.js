/* 封装axios用于发送请求 */
import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'

// 创建一个新的axios实例
const request = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers:{ platform:'H5'}
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner', //配置loading图标
    duration: 0 //不会自动消失
  })
  const userStore = useUserStore()
  const token = userStore.token
  if(token){
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const res = response.data
  if(res.status !== 200){
    // 错误提示
    showToast(res.message)
    //抛出错误promise
    return Promise.reject(res.message)
  }else{
    // 清除loading   ----toast只能同时存在一个，后一个后覆盖前一个
    closeToast()
  }
  return res
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request