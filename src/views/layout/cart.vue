<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import CountBox from '@/components/CountBox.vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()
const isEdit =ref(false)
onMounted(()=> {
  if(isLogin.value){
    cartStore.getCartAction()
  }
})
// 复选框是否进行选择
const toggleCheck = (id) => cartStore.toggleCheck(id)
// 全选
const toggleAllCheck = () => cartStore.toggleAllCheck(!cartStore.isAllChecked)

const changeCount = (goodsNum, goodsId, goodsSkuId) => {
  cartStore.changeCountAction({goodsNum, goodsId, goodsSkuId})
}
// 监视是否要进行编辑
watch(isEdit,(value)=>{
  if(value){
    cartStore.toggleAllCheck(false)
  } else{
    cartStore.toggleAllCheck(true)
  }
})

// 进行删除
const handleDel = async () => {
  if(cartStore.selCount === 0 ) return
  await cartStore.delSelect()
  isEdit.value = false 
}

// 用户是否登录
const isLogin = computed(()=> userStore.token)
//  去结算
const goPay = () => {
  // 判断有没有选中的商品
  // 有选中的商品才进行结算跳转
  if(cartStore.selCount >0 ) {
    router.push({
      path:'/pay',
      query: {
        mode:'cart',
        cartIds: cartStore.selCartList.map(item => item.id).join(',')
      }
    })
  }
}
</script>

<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />

    <div v-if="isLogin && cartStore.cartList.length > 0">
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all">共<i>{{ cartStore.cartTotal }}</i>件商品</span>
        <span class="edit" @click="isEdit = !isEdit">
          <van-icon name="edit" />
          {{ isEdit ? '取消' : '编辑' }}
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartStore.cartList" :key="item.goods_id">
          <van-checkbox @click="toggleCheck(item.goods_id)" v-model:model-value="item.isChecked" ></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
            <span class="bottom">
              <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
              <!-- 既希望保留原本的形参，又需要通过调用函数传参，可以用箭头函数包装一层 -->
              <CountBox 
                v-model:addCount="item.goods_num" 
                @update:add-count="(value) => changeCount(value, item.goods_id, item.goods_sku_id)"
                >
              </CountBox>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div @click="toggleAllCheck"  class="all-check">
          <van-checkbox :model-value="cartStore.isAllChecked"  icon-size="18"></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div class="price">
            <span>合计：</span>
            <span>¥ <i class="totalPrice">{{ cartStore.selPrice }}</i></span>
          </div>
          <div v-if="!isEdit" @click="goPay" class="goPay" :class="{ disabled:cartStore.selCount === 0}" >
            结算({{ cartStore.selCount }})
          </div>
          <div v-else @click="handleDel" class="delete" :class="{ disabled:cartStore.selCount === 0}">删除</div>
        </div>
      </div>
    </div>

    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="">
      <div class="tips">
        您的购物车是空的, 快去逛逛吧
      </div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay, .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}

// 空购物车样式
.empty-cart {
  padding: 80px 30px;
  img {
    width: 140px;
    height: 92px;
    display: block;
    margin: 0 auto;
  }
  .tips {
    text-align: center;
    color: #666;
    margin: 30px;
  }
  .btn {
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #fa2c20;
    border-radius: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>