import { Ref, ref, toRefs, reactive, watch } from 'vue'
import { userApi } from '@/api'
import { audioItem } from './types/playlist.type'

type useReturn = [any, (arg1?: any, arg2?: any) => void, any?]

const storage = useStorage()

// 登录状态: boolean
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

// 用户信息
let userInfo = reactive({})
export function useUserInfo(): useReturn {
  return [
    userInfo,
    (val: any) => {
      userInfo = Object.assign({}, userInfo, val)
    }
  ]
}

// 全局弹窗可见状态 key: boolean 形式
const modalVisibles: { [key: string]: boolean } = reactive({
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

// 全局加载状态
const mainSpining = ref<boolean>(false)
export function useSpining(): useReturn {
  return [
    mainSpining,
    (val: boolean) => {
      mainSpining.value = val
    }
  ]
}

// Storage操作
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

// 账户信息
let accountInfo = reactive(storage.get('userMessage')?.value?.accountInfo || {})
export function useAccount(): [any, (val: object) => void] {
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

// 全局播放器
interface playerInt {
  list: audioItem[]
  current: audioItem & object
  playing: boolean
}
const mainPlayer = reactive<playerInt>({
  list: [],
  current: Object.create(null),
  playing: false
})
const playerWatchStops: { [key: string]: () => void } = Object.create(null)
export function usePlayer(): {
  player: playerInt
  playerSubs: (
    name: keyof playerInt,
    callBack: (cur: any, pre?: any) => void
  ) => void
} {
  const player = mainPlayer
  const playerRefs = toRefs(player)
  const ret = {
    player,
    playerSubs(keyName: keyof playerInt, cb: (cur: any, pre?: any) => void) {
      // let val = toRef(player, name)
      // playerWatchStops[keyName] && playerWatchStops[keyName]()
      playerWatchStops[keyName] = watch(playerRefs[keyName], (val, pre) => {
        cb(val, pre)
      })
      return playerWatchStops[keyName]
    },
    playerWatchStops
  }
  return ret
}

// home滚动容器的共享
const isBottom = ref<boolean>(false) // 是否触底
const oscollHei = ref<number>(0) // 滚动区高度
export function useMainScroll(): {
  isBottom: Ref<boolean>
  oscollHei: Ref<number>
  reachBottom: (
    cb: (scroller: HTMLElement) => void,
    bottomOffset?: number
  ) => void
} {
  const ret = {
    isBottom,
    oscollHei,
    reachBottom(cb: (scroller: HTMLElement) => void, bottomOffset = 70) {
      const scroller = document.querySelector('.main_scroller') as HTMLElement
      const ohei = scroller.offsetHeight
      scroller.onscroll = null
      oscollHei.value = scroller.scrollHeight
      scroller.onscroll = function () {
        if (isBottom.value) return
        if (scroller.scrollTop + ohei + bottomOffset > oscollHei.value) {
          isBottom.value = true
          cb(scroller)
        }
      }
    }
  }
  return ret
}
