import { apiFunc, type apiInter } from '../featch'

const search: apiInter = {
  search: {
    method: 'get',
    url: '/search'
  },
  searchDefault: {
    url: '/search/default'
  }
}

const song: apiInter = {
  detail: {
    url: '/song/detail'
  }
}

export const searchApi =  apiFunc(search)
export const songApi = apiFunc(song)