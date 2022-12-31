import { apiFunc, type apiInter } from '../featch'

const search: apiInter = {
  search: {
    url: '/search'
  },
  defaultKey: {
    url: '/search/default'
  },
  hots: {
    url: '/search/hot'
  }
}

const song: apiInter = {
  banner: {
    url: '/banner'
  },
  detail: {
    url: '/song/detail'
  },
  homeBlocks: {
    url: '/homepage/block/page'
  },
  // 每日推荐歌单 (登录)
  recommendList: {
    url: '/recommend/resource'
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

export const searchApi = apiFunc(search)
export const songApi = apiFunc(song)
