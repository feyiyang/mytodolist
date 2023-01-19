import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { songApi, songsApi, albumApi } from '@/api'
import {
  playlistDetailInt,
  trackIdsInt,
  audioItem,
  commentItem
} from '@/utils/types/playlist.type'

interface resInt {
  code: number
  playlist: playlistDetailInt
  urls: string | null
  songs: Array<any>
  album?: playlistDetailInt
  hotComments?: commentItem[]
  comments?: commentItem[]
}

// **Todo: 考虑函数式处理
export function useDetails(lisType: 'playlist' | 'album') {
  const route = useRoute()
  const loading = ref<boolean>(true) // 信息加载
  const showMore = ref<boolean>(false) // 更多精彩评论
  const dataError = ref<boolean>(false) // 获取数据错误
  const details = ref<playlistDetailInt>() // 歌单|专辑 - 信息
  const songs = ref<any[]>([]) // 歌单|专辑 - 歌曲列表
  const trackIds = ref<trackIdsInt[]>([]) // 歌单 - 歌曲id集合
  const listTotal = ref<number>(0)
  const commentSize = ref<number>(50) // 获取歌单评论数 用于分页
  let curIds: number[] = [] // 歌单 - 歌曲id集合
  const comments = reactive<{
    hot: commentItem[]
    count: number
    new: commentItem[]
  }>({
    hot: [],
    count: 0,
    new: []
  })
  const loadList = ref<boolean>(false) // 歌曲列表加载状态
  const curPage = ref<number>(1)

  const playlist = {
    async getDetails() {
      songsApi
        .playlistDetail({ id: route.params.id })
        .then((res: resInt) => {
          loading.value = false
          if (res.code === 200) {
            details.value = res.playlist
            trackIds.value = res.playlist?.trackIds
            curIds = trackIds.value.map((v) => {
              return v.id
            })
            playlist.getSongs()
            playlist.getComments()
            listTotal.value = trackIds.value.length
          } else {
            dataError.value = true
          }
        })
        .catch((err) => {
          loading.value = false
          dataError.value = true
        })
    },
    async getSongs() {
      if (songs.value.length) return
      loadList.value = true
      await songApi
        .detail({
          ids: curIds.join(',')
        })
        .then((res: resInt) => {
          if (res.code === 200) {
            return Promise.resolve(res)
          }
          return songsApi.trackAll({ id: route.params.id })
        })
        .then((res: resInt) => {
          songs.value = res.songs
          loadList.value = false
        })
        .catch((err) => {
          loadList.value = false
          dataError.value = true
        })
    },
    getComments() {
      !comments.hot.length &&
        songsApi
          .commentHot({ id: route.params.id, type: 2 })
          .then((res: any) => {
            if (res.code === 200) {
              comments.hot = res.hotComments
            }
          })
      songsApi
        .commentList({
          id: route.params.id,
          limit: commentSize.value,
          offset: (curPage.value - 1) * 60
        })
        .then((res: any) => {
          if (res.code === 200) {
            comments.new = res.comments
          }
        })
    }
  }
  const album = {
    async getDetails() {
      loading.value = true
      await albumApi
        .detail({ id: route.params.id })
        .then((res: resInt) => {
          if (res.code === 200) {
            details.value = res.album
            songs.value = res.songs
          }
          album.getComments()
        })
        .finally(() => {
          loading.value = false
        })
    },
    getComments() {
      albumApi
        .comment({ id: route.params.id, limit: commentSize.value })
        .then((res: resInt) => {
          console.log(res)
          if (res.code === 200) {
            comments.hot = res.hotComments as commentItem[]
            comments.new = res.comments as commentItem[]
          }
        })
    }
  }
  const typedFetch = Object.create({ playlist, album })
  const ret: any = {
    curPage,
    loading,
    loadList,
    showMore,
    dataError,
    details,
    songs,
    comments,
    commentSize,
    listTotal,
    ...typedFetch[lisType]
  }
  return ret
}
