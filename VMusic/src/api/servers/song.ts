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

// 歌曲
const song: apiInter = {
  detail: {
    url: '/song/detail'
  },
  // 每日推荐歌单 (登录)
  recommendList: {
    url: '/recommend/resource'
  },
  // 音乐url
  getUrl: {
    url: '/song/url/v1'
  }
}

// 歌单
const songs: apiInter = {
  // 热门评论
  commentHot: {
    url: '/comment/hot'
  },
  // 歌单评论
  commentList: {
    url: '/comment/playlist',
    data: {
      limit: 60
      // 必选参数 : id: 歌单 id
      // offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
    }
  },
  // 歌单详情
  playlistDetail: {
    url: '/playlist/detail'
  },
  // 歌单所有歌曲
  trackAll: {
    url: '/playlist/track/all'
  }
}

const singer = {
  // 歌手分类列表
  list: {
    url: '/artist/list',
    // limit : 返回数量 , 默认为 30
    // offset : 偏移数量，用于分页
    // initial: 按首字母索引查找参数
  }
}

export const searchApi = apiFunc(search)
export const songApi = apiFunc(song)
export const songsApi = apiFunc(songs)
export const singerApi = apiFunc(singer)
