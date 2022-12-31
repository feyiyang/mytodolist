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
  }
}

export const userApi = apiFunc(user)
