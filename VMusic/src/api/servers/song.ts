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
  getMUrl: {
    url: '/song/url'
  },
  getUrl: {
    // 新接口
    url: '/song/url/v1'
  },
  // 歌词
  lyric: {
    url: '/lyric'
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
  },
  // 热门歌单
  hotcat: {
    url: '/playlist/hot'
  },
  // 歌单分类
  catlist: {
    url: '/playlist/catlist'
  },
  // 网友精选碟
  topsongs: {
    url: '/top/playlist'
  }
}

const singer = {
  // 歌手分类列表
  list: {
    url: '/artist/list'
    // limit : 返回数量 , 默认为 30
    // offset : 偏移数量，用于分页
    // initial: 按首字母索引查找参数
  },
  // 歌手-描述
  desc: {
    url: '/artist/desc'
  },
  // 歌手-详情
  detail: {
    url: '/artist/detail'
  },
  // 热门
  topsong: {
    url: '/artist/top/song'
  },
  // 歌手全部歌曲
  songs: {
    url: '/artist/songs',
    data: {
      order: 'hot'
    }
  },
  // 歌手专辑
  album: {
    url: '/artist/album'
  },
  // 歌手mv
  mvs: {
    url: '/artist/mv'
  }
}

const album = {
  detail: {
    url: '/album'
  },
  comment: {
    url: '/comment/album',
    data: {
      limit: 60
    }
  }
}

const mvs = {
  detail: {
    url: '/mv/url'
  }
}

export const searchApi = apiFunc(search)
export const songApi = apiFunc(song)
export const songsApi = apiFunc(songs)
export const singerApi = apiFunc(singer)
export const albumApi = apiFunc(album)
export const mvsApi = apiFunc(mvs)
