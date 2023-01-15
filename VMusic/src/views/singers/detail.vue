<template>
  <a-scrollbar
    outer-class="singer_page"
    class="main_scroller"
    :outer-style="{ width: '100%', height: '100%', overflow: 'hidden' }"
    style="padding: 0 40px; height: 100%; overflow: hidden auto"
  >
    <a-spin class="detail" :loading="loading">
      <div class="header" v-if="detail">
        <div class="cover">
          <a-image
            v-if="detail.user"
            class="img"
            :src="detail.user.avatarUrl + '?param=200y200'"
            :alt="detail.artist.name"
          />
          <a-image
            v-else
            class="img"
            :src="detail.artist.cover + '?param=200y200'"
            :alt="detail.artist.name"
          />
        </div>
        <div class="infos">
          <h2>{{ detail.artist.name }}</h2>
          <h3 class="alia">{{ detail.artist.alias?.join('、') }}</h3>
          <p class="intro">
            <span class="i">单曲数:{{ detail.artist.musicSize }}</span
            >&emsp; <span class="i">专辑数:{{ detail.artist.albumSize }}</span
            >&emsp;
            <span class="i">MV数:{{ detail.artist.mvSize }}</span>
          </p>
        </div>
      </div>
      <a-tabs :header-padding="false" lazy-load @change="tabChg">
        <a-tab-pane :key="0" title="歌曲">
          <ul class="songslist">
            <li class="song_item">
              <span class="info">歌曲</span>
              <span class="al">专辑</span>
              <span class="long">时长</span>
            </li>
            <li
              class="song_item"
              :class="{ active: song.id === playsongs.current.id }"
              v-for="(song, index) in songs"
              :key="index"
            >
              <span class="btn">
                <icon-play-arrow
                  class="play_arrow"
                  @click="playSongHandler(index)"
                />
              </span>
              <span class="info">
                <span
                  class="main"
                  :title="song.name + ' ' + song.alia.join(',')"
                >
                  {{ song.name }}
                  <span class="extra" v-if="song.alia.length">
                    ({{ song.alia.join(',') }})
                  </span>
                </span>
                <span class="fee" v-if="song.fee == 1"> VIP </span>
              </span>
              <span class="al" :title="song.al.name">
                {{ song.al.name }}
              </span>
              <span class="long">{{ longFmt(song.dt) }}</span>
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane :key="1" title="专辑">
          <ul class="als">
            <li
              class="al"
              v-for="(al, index) in albums"
              :key="index"
              @click="goAl(al)"
            >
              <span class="cover">
                <a-image
                  class="img"
                  :src="al.picUrl + '?param=300y300'"
                  :preview="false"
                ></a-image>
              </span>
              <p class="name">{{ al.name }}</p>
              <p class="pub_time">
                {{ dateFormat(new Date(al.publishTime), 'yy-MM-dd') }}
              </p>
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane :key="2" title="MV"></a-tab-pane>
        <a-tab-pane :key="3" title="详情"></a-tab-pane>
      </a-tabs>
      <icon-loading class="load_list" v-if="loadList" />
    </a-spin>
  </a-scrollbar>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { singerApi } from '@/api'
import { useMainScroll, usePlayer } from '@/utils/hooks'
import { longFmt, dateFormat } from '@/utils'
import router from '@/router'

interface artistInt {
  albumSize?: number
  alias?: string[]
  briefDesc?: string
  cover?: string
  id: number
  identifyTag?: string[]
  musicSize?: number
  mvSize?: number
  name: string
}
interface detInt {
  artist: artistInt
  user?: any
}

const route = useRoute()
const { isBottom } = useMainScroll()
const { player: playsongs } = usePlayer() // 播放器playbar
const detail = ref<detInt | null>(null)
const loading = ref<boolean>(true)
const loadList = ref<boolean>(false)
const songs = ref<any[]>([])
const albums = ref<any[]>([])
const curPage = ref<number>(0)

onBeforeMount(async () => {
  await singerApi
    .detail({ id: route.params.id })
    .then((res) => {
      if (res.artist) {
        detail.value = res
      }
    })
    .finally(() => {
      loading.value = false
    })
  await getSongs()
})

async function getSongs() {
  loadList.value = true
  await singerApi
    .songs({ id: route.params.id, limit: 50, offset: curPage.value * 50 })
    .then((res) => {
      if (res.code === 200) {
        songs.value = res.songs
        isBottom.value = !res.more
        if (res.more) {
          curPage.value++
        }
      }
    })
    .finally(() => {
      loadList.value = false
    })
}
async function getAlbum() {
  loadList.value = true
  await singerApi
    .album({ id: route.params.id })
    .then((res) => {
      if (res.code === 200) {
        albums.value = res.hotAlbums
        if (res.more) {
          curPage.value++
        }
      }
    })
    .finally(() => {
      loadList.value = false
    })
}
function tabChg(key: number | string) {
  let handlers: any = {
    0: getSongs,
    1: getAlbum
  }
  handlers[key]()
}
function playSongHandler(n: number): void {
  playsongs.list = songs.value
  playsongs.current = { queueIndex: n, ...songs.value[n || 0] }
  playsongs.playing = true
}
function goAl(al: any): void {
  router.push({
    path: `/playlists/${al.id}`,
    query: { type: 'al' }
  })
}
</script>
<style lang="scss" scoped>
.header {
  padding-bottom: 20px;
  overflow: hidden;
  .cover {
    float: left;
    width: 11rem;
    height: 11rem;
    margin-right: 16px;
    border-radius: 6px;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  h2 {
    font-size: 24px;
  }
  h3.alia {
    padding: 16px 0;
    font: {
      size: 12px;
      weight: normal;
    }
  }
}
@mixin ovelli {
  overflow: hidden;
  text-overflow: ellipsis;
}
.songslist .song_item {
  display: flex;
  padding: 10px 6px;
  align-items: center;
  white-space: nowrap;
  line-height: 2;
  &:first-of-type {
    padding: 6px 0;
    color: $textlight;
  }
  &:hover,
  &.active {
    background-color: #f7f8fa;
  }
  &.active {
    color: $somegreen;
  }
  .btn {
    padding-right: 10px;
    cursor: pointer;
  }
  .info {
    width: 56%;
    padding-right: 10px;
    flex-grow: 1;

    .main {
      display: inline-block;
      max-width: 90%;
      vertical-align: middle;
      @include ovelli;
    }
    .fee {
      display: inline-block;
      padding: 2px 4px;
      transform: scale(65%);
      font-size: 10px;
      line-height: 1;
      color: $somegreen;
      border: 1px $somegreen solid;
      border-radius: 4px;
    }
    .extra {
      color: $textlight;
    }
  }
  .al,
  .long {
    flex-shrink: 0;
    @include ovelli;
  }
  .al {
    width: 180px;
  }
  .long {
    width: 80px;
  }
}
.als {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  .al {
    width: calc(25% - 15px);
    margin: 0 20px 20px 0;
    font-size: 12px;
    &:nth-of-type(4n) {
      margin: 0;
    }
    .cover {
      display: block;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      &:hover {
        transform: translateY(-8px);
      }
    }
    .img {
      width: 100%;
      min-height: 5rem;
      border-radius: 6px;
    }
    .name {
      padding: 8px 0 4px;
      line-height: 1.6;
      cursor: pointer;
      &:hover {
        color: $mygreen;
      }
    }
    .pub_time {
      color: $textlight;
    }
  }
}
.load_list {
  text-align: center;
}
</style>
