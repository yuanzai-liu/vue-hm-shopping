import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCartListAPI, changeCountAPI, delSelectAPI } from '@/api/cart'
import { showToast } from 'vant'

export const useCartStore = defineStore('hm_shopping_cart',()=>{
  const cartList = ref([])
  const getCartAction = async () => {
    const res = await getCartListAPI()
    res.data.list.forEach(item => item.isChecked =true )
    cartList.value = res.data.list
  }
  // 求所有的商品累加总数
  const cartTotal = computed(() => cartList.value.reduce((sum, item) => sum + item.goods_num, 0 ))
  // 选中的商品项
  const selCartList = computed(() => cartList.value.filter(item => item.isChecked ))
  // 选中的总数
  const selCount = computed(() => selCartList.value.reduce((sum, item) => sum + item.goods_num, 0 ))
  // 选中的总价
  const selPrice = computed(() => {
    return selCartList.value.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0 ).toFixed(2)
  })

  const toggleCheck = (id) =>{
    const goods = cartList.value.find(item => item.goods_id === id)
    goods.isChecked ==! goods.isChecked
  }
  // 是否全选
  const isAllChecked = computed(() => {
    return cartList.value.every(item => item.isChecked)
  })

  const toggleAllCheck = (flag) => {
    cartList.value.forEach(item => item.isChecked = flag)
  }

  const changeCount = ({goodsNum, goodsId}) => {
    const goods = cartList.value.find(item => item.goods_id === goodsId)
    goods.goods_num =goodsNum
  }
  const changeCountAction = async (obj) => {
    const {goodsNum, goodsId, goodsSkuId} = obj
    changeCount({goodsNum, goodsId})
    // 先本地修改，再同步后台
    await changeCountAPI(goodsId, goodsNum, goodsSkuId)
  }
  // 删除购物车数据
  const delSelect = async () => {
    const cartIds = selCartList.value.map(item => item.id)
    await delSelectAPI(cartIds)
    showToast('删除成功')
    // 删除完后，重新拉取数据
    getCartAction()
  }
  return{   
    selCartList,
    cartTotal,
    cartList,
    selCount,
    selPrice,   
    isAllChecked,
    getCartAction,
    toggleCheck,
    toggleAllCheck,
    changeCount,
    changeCountAction,
    delSelect
  }
})