<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProductAPI } from '@/api/product'
import GoodsItem from '@/components/GoodsItem.vue'

const route = useRoute()
const querySearch = computed(() =>  route.query.search || '搜索商品' )
const page = ref(1)
const proList = ref([])
const getProduct = async () => {
  const { data: { list} } = await getProductAPI({
    categoryId: route.query.categoryId,
    goodsName: querySearch.value,
    page: page.value
  })
  proList.value = list.data  
}
onMounted(() => getProduct())

// 综合排序
const newProList= () => {
  proList.value.sort((a, b) => a.goods_id - b.goods_id) 
}
// 按销售量排序
const saleList = () => {
  proList.value.sort((a, b) => b.goods_sales - a.goods_sales) 
}
// 按价格排序
const priceList = () => {
  proList.value.sort((a, b) => a.goods_price_min - b.goods_price_min) 
}
</script>

<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      v-model="querySearch"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div class="sort-item" @click="newProList">综合</div>
      <div class="sort-item" @click="saleList">销量</div>
      <div class="sort-item" @click="priceList">价格 </div>
    </div>

    <div class="goods-list">
      <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>  