import { apiFunc, type apiInter } from '../featch'

const user: apiInter = {
  loginEmail: {
    url: '/login'
  },
  loginQrKey: {
    url: '/login/qr/key'
  },
  loginQrCreate: {
    url: '/login/qr/create',
    method: 'post',
    data: {
      qrimg: true
    }
  },
  loginQrCheck: {
    url: '/login/qr/check'
  },
  getAccount: {
    url: '/user/account'
  },
  // 游客登录
  anonimous: {
    url: '/register/anonimous',
    method: 'GET'
  },
  // 发送验证码
  sent: {
    url: '/captcha/sent',
    method: 'GET'
  },
  // 验证验证码
  verify: {
    url: '/captcha/verify'
  }
}

export const userApi = apiFunc(user)
