import { ref, reactive } from 'vue'
import { docCookies } from '@/utils/cookie'

console.log(docCookies.getItem('login'))

type useReturn = [any, Function]

const isLogin = ref<boolean>(false)
export function useLoginState(): useReturn {
  return [isLogin.value, (val: boolean): void => {
    isLogin.value = val
  }]
}

let userInfo = reactive({})
export function useUserInfo() {
  return [userInfo, (val: any) => {
    userInfo = Object.assign({}, userInfo, val)
  }]
}

const modalVisibles: any = reactive({
  login: false
})
export function useShowModals() {
  return [modalVisibles, (key: string, val: boolean): void => {
    modalVisibles[key] = val
  }]
}

const mainSpining = ref<boolean>(false)
export function useSpining() {
  return [mainSpining, (val: boolean) => {
    mainSpining.value = val
  }]
}