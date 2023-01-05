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
      limit: 8
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
  }
}

export const homeApi = apiFunc(home)
