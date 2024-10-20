//登录相关的接口请求
import request from '@/utils/request'
// 获取图形验证码
export const getPicCodeAPI = () => request.get('/captcha/image')

// 获取短信验证码
export const getMsgCodeAPI = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 验证码登录
export const codeLoginAPI = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      mobile,
      partyData: {},
      smsCode
    }
  })
}