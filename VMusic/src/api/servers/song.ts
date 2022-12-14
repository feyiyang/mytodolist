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
  detail: {
    url: '/song/detail'
  }
}

export const searchApi =  apiFunc(search)
export const songApi = apiFunc(song)