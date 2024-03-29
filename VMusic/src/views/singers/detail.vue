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
        <a-tab-pane :key="0" :title="`歌曲${songsTotal}`">
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
          <p class="ctr">
            <span
              class="styles"
              v-if="alStyle == 'normal'"
              @click="chgStyle('folder')"
              >|||</span
            >
            <span class="styles" v-else @click="chgStyle('normal')">■■■■</span>
          </p>
          <ul :class="['als', alStyle]">
            <li
              class="al"
              v-for="(al, index) in albums"
              :key="index"
              @click="goAl(al)"
            >
              <div
                class="cover"
                :style="{ backgroundImage: `url(${al.picUrl}?param=300y300)` }"
              ></div>
              <div class="infos">
                <p class="name">{{ al.name }}</p>
                <p class="pub_time">
                  {{ dateFormat(new Date(al.publishTime), 'yy-MM-dd') }}
                </p>
              </div>
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane :key="2" title="MV">
          <ul class="mvs">
            <li class="mv_item" v-for="(mv, index) in mvs" :key="index">
              <div class="cover" @click="seeMv(mv)">
                <a-image
                  class="img"
                  :src="mv.imgurl + '?param=260y195'"
                  :alt="mv.name"
                  :preview="false"
                ></a-image>
                <span class="count"><icon-play-arrow />{{ mv.playCount }}</span>
                <span class="long">{{ longFmt(mv.duration) }}</span>
              </div>
              <p class="title" :title="mv.name">{{ mv.name }}</p>
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane :key="3" title="详情"></a-tab-pane>
      </a-tabs>
      <div class="load_list" :hidden="!loadList">
        <icon-loading class="load_ico" />
      </div>
    </a-spin>
  </a-scrollbar>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { singerApi, mvsApi } from '@/api'
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
const songsTotal = ref<number>(0)
const albums = ref<any[]>([])
const mvs = ref<any[]>([])
const curPage = ref<number>(0)
let hasMore = false
const alStyle = ref<string>('normal')

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
  if (!curPage.value) {
    songs.value = []
  }
  await singerApi
    .songs({ id: route.params.id, limit: 50, offset: curPage.value * 50 })
    .then((res) => {
      if (res.code === 200) {
        songs.value = songs.value.concat(res.songs)
        isBottom.value = !res.more
        songsTotal.value = res.total
        if (res.more) {
          curPage.value++
        }
        hasMore = res.more
      }
    })
    .finally(() => {
      loadList.value = false
    })
}
async function getAlbum() {
  loadList.value = true
  if (!curPage.value) {
    albums.value = []
  }
  await singerApi
    .album({ id: route.params.id, limit: 50 })
    .then((res) => {
      if (res.code === 200) {
        albums.value = albums.value.concat(res.hotAlbums)
        if (res.more) {
          curPage.value++
        }
      }
    })
    .finally(() => {
      loadList.value = false
    })
}
async function getMv() {
  loadList.value = true
  await singerApi
    .mvs({ id: route.params.id, limit: 50 })
    .then((res) => {
      console.log(res)
      if (res.code === 200) {
        mvs.value = mvs.value.concat(res.mvs)
      }
    })
    .finally(() => {
      loadList.value = false
    })
}
function tabChg(key: number | string) {
  curPage.value = 0
  let handlers: any = {
    0: getSongs,
    1: getAlbum,
    2: getMv
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
    query: { type: 'album' }
  })
}
function chgStyle(st = 'normal') {
  alStyle.value = st
}
function seeMv(mv: any) {
  mvsApi.detail({ id: mv.id }).then((res: any) => {
    if (res.code === 200) {
      window.open(res.url)
    }
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
    width: 176px;
    height: 220px;
    margin: 0 20px 20px 0;
    overflow: hidden;
    font-size: 12px;
    // transition: all 0.4s linear;
    &:nth-of-type(4n) {
      margin: 0;
    }
    .cover {
      display: block;
      width: 176px;
      height: 176px;
      background-size: cover;
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
  &.folder {
    .al {
      position: relative;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      width: 76px;
      height: 276px;
      margin: 0 10px 10px 0;
      overflow: hidden;
      border-radius: 4px;
      &:nth-of-type(9n) {
        margin-right: 0;
      }
      .cover {
        height: 264px;
        margin-top: 5px;
        background-position: 15% center;
        .img {
          height: 170px;
          border-radius: 0;
          :deep(img) {
            width: 100%;
            height: 100%;
          }
        }
      }
      &:hover .cover {
        background-position: 120% center;
      }
      .infos {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column-reverse;
        justify-content: space-between;
        align-items: flex-end;
        overflow: hidden;
        border-radius: 4px;
        box-shadow: inset 0 0 2px 4px rgba(200, 205, 208, 0.85);
      }
      p {
        width: 2.6em;
        padding: 2px;
        border-radius: 2px;
        color: #000;
        text-align: center;
        letter-spacing: 1px;
        &.name {
          margin: 4px 2px;
          font-size: 14px;
          transform: scale(0.85);
          background-color: rgba(220, 222, 222, 0.6);
          backdrop-filter: blur(2px);
        }
        &.pub_time {
          width: auto;
          margin: 0;
          align-self: flex-start;
          transform: scale(0.85);
          background-color: rgba(220, 222, 222, 0.5);
          word-break: break-word;
          font-size: 10px;
          // backdrop-filter: blur(2px);
        }
      }
    }
  }
}
.ctr {
  margin-top: -10px;
  display: block;
  text-align: right;
  .styles {
    margin-top: -16px;
    display: inline-block;
    width: 26px;
    height: 22px;
    overflow: hidden;
    word-break: break-all;
    color: $bgrey;
    letter-spacing: 4px;
    cursor: pointer;
  }
}
.mvs {
  display: flex;
  flex: 1 1 1;
  flex-wrap: wrap;
  .mv_item {
    width: calc(33.33% - 20px);
    margin-right: 20px;
  }
  .cover {
    position: relative;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    .img {
      height: 9rem;
      overflow: hidden;
      border-radius: 4px;
    }
    .count {
      position: absolute;
      right: 10px;
      top: 5px;
    }
    .long {
      position: absolute;
      right: 10px;
      bottom: 4px;
    }
  }
  .title {
    width: 100%;
    padding: 5px 0 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1.4;
  }
}
.load_list {
  text-align: center;
}
</style>
