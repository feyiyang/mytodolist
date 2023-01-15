import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { songApi, songsApi } from '@/api'
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
}

// **Todo: 考虑函数式处理

const route = useRoute()
const loading = ref<boolean>(true) // 信息加载
const showMore = ref<boolean>(false) // 更多精彩评论
const dataError = ref<boolean>(false) // 获取数据错误
export function useDetails(type: string) {
  const playListDet = ref<playlistDetailInt>() // 歌单信息
  const trackIds = ref<trackIdsInt[]>([]) // 歌曲id集合
  const songs = ref<any[]>([]) // 歌曲列表
  let curIds: number[] = [] // 歌曲id集合
  const comments = ref<{ hot: any; count: number; new: any }>({
    hot: [],
    count: 0,
    new: []
  })
  const loadList = ref<boolean>(false) // 歌曲列表加载状态
  const curPage = ref<number>(0)
  const ret = {
    curPage,
    comments,
    showMore,
    dataError,
    detail: playListDet,
    songs,
    playlist: {
      trackIds,
      async getDet() {
        songsApi
          .playlistDetail({ id: route.params.id })
          .then((res: resInt) => {
            if (res.code === 200) {
              playListDet.value = res.playlist
              trackIds.value = res.playlist?.trackIds
              // totalPage = Math.ceil(trackIds.value.length / perPage)
              curIds = trackIds.value.map((v) => {
                return v.id
              })
              // ret.playlist.getSongs()
              // getComments()
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
      async getComments() {
        !comments.value?.hot.length &&
          songsApi
            .commentHot({ id: route.params.id, type: 2 })
            .then((res: any) => {
              if (res.code === 200) {
                comments.value.hot = res.hotComments
              }
            })
        // if (!newComments.value.length && init) return
        songsApi
          .commentList({
            id: route.params.id,
            offset: (curPage.value - 1) * 60
          })
          .then((res: any) => {
            if (res.code === 200) {
              comments.value.new = res.comments
            }
          })
      }
    }
  }
}
