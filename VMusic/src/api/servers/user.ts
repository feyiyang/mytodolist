import { apiFunc, type apiInter } from '../featch'

const user: apiInter = {
  loginEmail: {
    url: '/login'
  }
}
export const userApi = apiFunc(user)