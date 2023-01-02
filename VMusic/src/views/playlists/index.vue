<template>
  <a-spin class="playlist_page" :loading="loading">
    <div class="contain" v-if="details">
      <a-row class="header" :gutter="24">
        <a-col :span="6">
          <img class="cover_img" :src="details?.coverImgUrl" />
        </a-col>
        <a-col :span="18">
          <strong class="title">
            {{ details.name }}
          </strong>
          <div class="info">
            <img class="avatar" :src="details.creator.avatarUrl" alt="" />
            {{ details.creator.nickname }}
            <span class="tag" v-for="(tag, index) in details.tags" :key="index">
              #{{ tag }}
            </span>
          </div>
          <div class="btns">
            <a-button class="btn_play" size="small">播放全部</a-button>
          </div>
          <div class="intro"></div>
        </a-col>
      </a-row>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { songApi } from '@/api'
import { playlistDetailInt } from '@/utils/types/playlist.type'

const route = useRoute()
const details = ref<playlistDetailInt | null>(null)
const loading = ref<boolean>(true)
onMounted(() => {
  if (details.value) return
  songApi
    .playlistDetail({ id: route.params.id })
    .then((res: resInt) => {
      console.log(res)
      loading.value = false
      details.value = res.playlist
    })
    .catch((err) => {
      loading.value = false
    })
})

interface resInt {
  code: number
  playlist: playlistDetailInt
  urls: string | null
}
</script>
<style lang="scss" scoped>
.contain {
  padding: $containPadding;
}
.cover_img {
  width: 100%;
  height: auto;
}
strong.title {
  display: block;
  padding: 6px 0 16px;
  font-size: 24px;
  color: #444;
}
img.avatar {
  width: 22px;
  border-radius: 12px;
}
.tag {
  margin-left: 12px;
  color: $textlight;
}
.btn_play {
  @include linerBg;
  color: #fff;
  border-radius: 20px;
}
.btns {
  padding: 20px 0;
}
.intro {
  height: 1em;
  overflow: hidden;
}
</style>
