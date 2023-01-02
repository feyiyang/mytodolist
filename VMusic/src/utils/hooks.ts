import { Ref, ref, reactive } from 'vue'
import { userApi } from '@/api'

type useReturn = [any, (arg1?: any, arg2?: any) => void, any?]

const storage = useStorage()

const isLogin = ref<boolean>(storage.get('isLogin') || false)
export function useLoginState(): useReturn {
  return [
    isLogin.value,
    (val: boolean): void => {
      isLogin.value = val
      storage.set('isLogin', val)
    },
    localStorage.getItem('token')
  ]
}

let userInfo = reactive({})
export function useUserInfo(): useReturn {
  return [
    userInfo,
    (val: any) => {
      userInfo = Object.assign({}, userInfo, val)
    }
  ]
}

const modalVisibles: any = reactive({
  login: false
})
export function useShowModals(): useReturn {
  return [
    modalVisibles,
    (key: string, val: boolean): void => {
      modalVisibles[key] = val
    }
  ]
}

const mainSpining = ref<boolean>(false)
export function useSpining(): useReturn {
  return [
    mainSpining,
    (val: boolean) => {
      mainSpining.value = val
    }
  ]
}

export function useStorage(
  storage: Storage = localStorage,
  defaults?: any
): { [method: string]: (key: string, val?: any) => any } {
  function get(key: string): Ref<any> {
    const value: any = storage.getItem(key)
    try {
      if (value === undefined) return ref(defaults)
      const res = JSON.parse(value)
      if (res?.data) return ref(res.data)
      return ref(res)
    } catch (err: any) {
      console.error(err)
      return ref(value || undefined)
    }
  }
  function set(key: string, val: any): void {
    storage.setItem(
      key,
      JSON.stringify({ type: typeof val, data: val, _t: new Date() })
    )
  }
  function remove(key: string | undefined) {
    if (!key) {
      storage.clear()
    } else {
      storage.removeItem(key)
    }
  }
  return {
    set,
    get,
    remove
  }
}

let accountInfo = reactive(storage.get('userMessage')?.value?.accountInfo || {})
export function useAccount(): [any, Function] {
  if (!accountInfo?.account?.id && isLogin.value) {
    userApi.getAccount().then((res: any) => {
      accountInfo.account = res.account
      accountInfo.profile = res.profile
      storage.set('userMessage', {
        accountInfo
      })
    })
  }
  return [
    accountInfo,
    (val: object) => {
      accountInfo = reactive(Object.assign({}, accountInfo, val))
    }
  ]
}
