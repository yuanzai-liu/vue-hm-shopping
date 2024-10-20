<script setup>
import { ref,  onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showDialog, showConfirmDialog, showToast } from 'vant'
import { getProDetailAPI, getProCommentsAPI } from '@/api/product'
import { addCartAPI }  from '@/api/cart'
import defaultImg from '@/assets/default-avatar.png'
import CountBox from '@/components/CountBox.vue'

const route = useRoute()
const router = useRouter()
const images = ref([])
const current = ref(0)
const detail = ref({})
const goodsId = ref(route.params.id)
const onChange = (index) => current.value = index
const getDetail = async () => {
    const { data } = await getProDetailAPI(goodsId.value)
    detail.value = data.detail
    images.value = data.detail.goods_images      
}
// 评论
const total = ref(0)
const commentList = ref([])
const getComments = async (n) => {
  const res = await getProCommentsAPI(goodsId.value, n )
  total.value = res.data.total
  commentList.value = res.data.list
}
// 评论页码
const CommentsPage =ref(3)
// 更多评论
const CommentsMore = async () => {
  CommentsPage.value+=3
  getComments(CommentsPage.value)
}
onMounted(() => {
  getDetail()
  getComments(CommentsPage.value)
})
// 显示七天无理由退货与48小时内发货
const showDia = () => {
  showDialog({
  message: `七天无理由退货政策
为了提升客户购物体验，我们提供七天无理由退货服务。自您收到商品之日起，您可以在7天内申请退货，无需说明理由。请确保商品未使用、包装完好，并附上购买凭证。申请退货后，我们将尽快处理，并为您办理退款手续，让您的购物更加轻松无忧。
  48小时发货承诺
我们承诺在您下单后的48小时内完成发货，以确保您能够快速收到心仪的商品。我们的物流团队会及时处理您的订单，并选择可靠的快递公司进行配送，让您无需等待，尽早享受优质商品。如果因不可抗力因素导致延迟，我们会及时与您沟通并提供解决方案。购物无忧，迅速到手！`,
  theme: 'round-button'
  })
}
// 控制弹层
const showPannel =ref(false)
// 标记弹层状态
const mode = ref('cart')
// 加入购物车
const addFn = () => {
  mode.value = 'cart'
  showPannel.value = true
}
// 立即购买
const buyFn = () => {
  mode.value = 'buyNow'
  showPannel.value = true
}
//数字框绑定的数字
const addCount = ref(1)

const userStore = useUserStore()
const cartTotal =ref(0)
const addCart = async () => {
  if(loginConfirm()) return
  const res = await addCartAPI(goodsId.value, addCount.value, detail.value.skuList[0].goods_sku_id)
  cartTotal.value = res.data.cartTotal
  showToast('加入购物车成功')
  showPannel.value = false
  addCount.value = 1
}
const goBuyNow = () => {
  // 未登录的处理：需要弹出一个确认框 
  if(loginConfirm()) return
  router.push({
    path:'/pay',
    query: {
      mode:'buyNow',
      goodsId: goodsId.value,
      goodsSkuId: detail.value.skuList[0].goods_sku_id,
      goodsNum: addCount.value
    }
  })
}
// 登录确认框:根据登陆状态，判断是否需要显示登录框
const loginConfirm = () => {
    // 判断token存不存在，如果token不存在，则弹窗去登录；如果token存在，则继续操作
    if(!userStore.token ){
    showConfirmDialog({
      title: '温馨提示',
      message:'此时需要先登录才能继续操作哦。',
      confirmButtonText:'去登陆',
      cancelButtonText:'再逛逛'
    })
    .then(() => {   //.then表示点击了确认，需要去干嘛
      router.replace({
        path:'/login',
        query:{
          backUrl: route.fullPath
        }
      })
    })
    .catch(() => {}) //.catch表示点击了取消
    return true
  }
  return false
}
</script>

<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ detail.goods_price_min }}</span>
          <span class="oldprice">￥{{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <div class="service" @click="showDia">
        <div class="left-words" >
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon" >
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ total }}条)</div>
        <div class="right" @click="CommentsMore">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url || defaultImg " alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :model-value="item.score/2" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content">   
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div @click="router.push('/')" class="icon-home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div @click="router.push('/cart')" class="icon-cart">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div @click="addFn" class="btn-add">加入购物车</div>
      <div @click="buyFn" class="btn-buy">立刻购买</div>
    </div>

    <!--加入购物车弹层  -->
    <van-action-sheet v-model:show="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="images[0].external_url" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ detail.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ detail.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <CountBox v-model:addCount="addCount"></CountBox>
        </div>
        <div class="showbtn" @click="addCart" v-if="detail.stock_total > 0">
          <div class="btn" v-if="mode === 'cart'">加入购物车</div>
          <div class="btn now" v-else @click="goBuyNow">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}
    
.tips {
  padding: 10px;
}

// 弹层样式
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
// 弹层样式
.footer .icon-cart {
  position: relative;
  padding: 0 6px;
  .num {
    z-index: 999;
    position: absolute;
    top: -2px;
    right: 0;
    min-width: 16px;
    padding: 0 4px;
    color: #fff;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 50%;
  }
}
</style>  