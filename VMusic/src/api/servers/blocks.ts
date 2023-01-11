// 页面各个模块接口
import { apiFunc, type apiInter } from '../featch'

// 首页模块
const home: apiInter = {
  // Banner
  banner: {
    url: '/banner'
  },
  // 首页发现
  homeBlocks: {
    url: '/homepage/block/page'
  },
  // 推荐歌单
  personalized: {
    url: '/personalized',
    data: {
      limit: 12
    }
  },
  // 推荐电台
  djprogram: {
    url: '/personalized/djprogram'
  },
  // 推荐电台
  djrecommend: {
    url: '/program/recommend'
  },
  // 推荐MV
  mvprogram: {
    url: '/personalized/mv'
  },
  // 推荐新音乐
  newsong: {
    url: '/personalized/newsong'
  }
}

const toplists: apiInter = {
  // 所有榜单
  list: {
    url: '/toplist'
  },
  // 所有榜单内容摘要
  about: {
    url: '/toplist/detail'
  }
}

export const homeApi = apiFunc(home)
export const topsApi = apiFunc(toplists)
