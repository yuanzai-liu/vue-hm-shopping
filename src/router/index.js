import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import Layout from '@/views/layout/index.vue'
import Home from '@/views/layout/home.vue'
import Category from '@/views/layout/category.vue'
import Cart from '@/views/layout/cart.vue'
import User from '@/views/layout/user.vue'
// 路由懒加载
const Login = () => import ( '@/views/login/index.vue')
const Search = () => import ( '@/views/search/index.vue')
const SearchList = () => import ( '@/views/search/list.vue')
const ProDetail = () => import ( '@/views/prodetail/index.vue')
const Pay = () => import ( '@/views/pay/index.vue')
const MyOrder = () => import ( '@/views/myorder/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: Home
        },
        {
          path: '/category',
          component: Category
        },
        {
          path: '/cart',
          component: Cart
        },
        {
          path: '/user',
          component: User
        }
      ]
    },
    { 
      path: '/search',
      component: Search
    },
    {
      path: '/searchlist',
      component: SearchList
    },
    {
      path: '/prodetail/:id',
      component: ProDetail
    },
    {
      path: '/pay',
      component: Pay
    },
    {
      path: '/myorder',
      component: MyOrder
    }
  ]
})

// 定义一个数组，专门用户存放所有需要权限访问的页面
const authUrls = ['/pay', '/myorder']
  // 全局前置守卫
  // 1. to 往哪里去， 到哪去的路由信息对象  
  // 2. from 从哪里来， 从哪来的路由信息对象
  // 3. next() 是否放行
  // 如果next()调用，就是放行
  // next(路径) 拦截到某个路径页面
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if( !authUrls.includes(to.path)){
    next()
    return
  }

  // 权限页面
  const token = userStore.token
  if( token ) {
    next()
  }else{
    next('/login')
  } 
})
export default router
