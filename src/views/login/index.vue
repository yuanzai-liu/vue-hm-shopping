<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import CryptoJS from 'crypto-js'
import { useRouter, useRoute } from 'vue-router'
import { getPicCodeAPI, getMsgCodeAPI, codeLoginAPI } from '@/api/login'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
// 用户输入的 图形验证码
const picCode = ref('')

// 将来请求传递的图形验证码唯一标识
const picKey = ref('')

// 存储请求渲染的图片地址
const picUrl = ref('')
// 存储图形验证码的md5
const picMD5 = ref('')

// 获取图形验证码
const getPicCode = async () => {
  const res = await getPicCodeAPI ()
  picKey.value = res.data.key
  picUrl.value = res.data.base64
  picMD5.value = res.data.md5   
}
onMounted(() => getPicCode())

// 校验手机号码和图形验证码
// 手机号码 15751776629
const mobile =ref('15706630041')
// 通过返回true，否则false
const validFn = () => {
  if(!/^1[3-9]\d{9}$/.test(mobile.value)){
    showToast('请输入正确的手机号码！')
    return false
  }
  // !/^\w{4}$/.test(picCode.value)
  // 将输入的验证码picCode转换成密码md5的形式，然后与后台的md5进行对比
  if(CryptoJS.MD5(picCode.value).toString() !== picMD5.value){
    showToast('请输入正确的图形验证码！')
    return false
  }
  return true
}

// 倒计时-总秒数
const totalSecond = ref(60)
// 当前秒数
const second = ref(60)
// 定时器ID
const timer = ref(null)
// 获取短信验证码
const getCode = async () => {
  // 如果未通过校验，则不往下继续执行
  if(!validFn())  return
  // 当前没有定时器，且totalSecond和second相等时才能开启定时器
  if(!timer.value && second.value === totalSecond.value){
    // 发送请求
    await getMsgCodeAPI(picCode.value, picKey.value, mobile.value)
    showToast('短信发送成功！')
    console.log('短信验证码默认为246810')
    
    // 开启倒计时
    timer.value = setInterval(() => {
      second.value--
      if( second.value <= 0 ) {
        clearInterval(timer.value)
        // timer.value = null
        second.value = totalSecond.value      
      }   
    },1000)
  }
}
// 离开页面时，需要清除定时器
onUnmounted(() => clearInterval(timer.value))

// 短信验证码
const msgCode = ref('')
const router = useRouter()
// 登录
const login = async () => {
  if (!validFn()) return
  if (!/^\d{6}$/.test(msgCode.value)) {
    showToast('请输入正确的手机验证码！')
    return
  }
  const res = await codeLoginAPI(mobile.value, msgCode.value)
  userStore.setUserInfo(res.data)
  showToast('登录成功！')
  // 判断地址栏是否有回跳地址，如果有，则去回跳地址
  const url = route.query.backUrl || '/'
  router.replace(url)
}
</script>

<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" alt="" @click="getPicCode">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            {{ second === totalSecond ? '获取验证码' : second + '秒后重新发送'}}
          </button>
        </div>
      </div>

      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>  

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>