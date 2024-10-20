import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCartStore } from './cart'

export const useUserStore = defineStore(
  'hm_shopping_userInfo',
  () => {
    const token = ref('')
    const userId = ref('')
    const setUserInfo = (obj) => {
      token.value = obj.token
      userId.value = obj.userId
    }
    const removeUserInfo = () => {
      token.value = '',
      userId.value = ''
    }
    // 退出登录
    const logout = () => {
      // 个人信息重置
      setUserInfo('')
      // 购物车信息重置
      const cartStore = useCartStore()
      cartStore.cartList = [] 
    }
    return{
     token,
     userId,
     setUserInfo,
     removeUserInfo,
     logout 
    }
  },{
    persist: true
  }
)