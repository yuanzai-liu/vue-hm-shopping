<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMyOrderListAPI } from '@/api/order'
import OrderListItem from '@/components/OrderListItem.vue'

const route = useRoute()
const active = ref( route.query.dataType || 'all')
const page = ref(1)
const list = ref([])
const getOrderList = async () => {
  const res = await getMyOrderListAPI(active.value, page.value)
  res.data.list.data.forEach( item => {
    item.total_num = 0
    item.goods.forEach( goods => {
      item.total_num += goods.total_num
    })
  })
  list.value = res.data.list.data
}
onMounted(() => getOrderList())
</script>

<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active" sticky>
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="payment" title="待支付"></van-tab>
      <van-tab name="delivery" title="待发货"></van-tab>
      <van-tab name="received" title="待收货"></van-tab>
      <van-tab name="comment" title="待评价"></van-tab>
    </van-tabs>

    <OrderListItem v-for="item in list" :key="item.order_id" :item="item"></OrderListItem>
  </div>
</template>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
}
.van-tabs {
  position: sticky;
  top: 0;
}
</style> 