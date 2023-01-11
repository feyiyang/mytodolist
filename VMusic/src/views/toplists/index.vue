<template>
  <ul class="main_tops">
    <li v-for="(top, index) in mainTops" :key="index" class="top_item">
      <span class="cover">
        <img :src="top.coverImgUrl" :alt="top.name" object-fit="cover">
        <span class="info">{{ dateFormat(new Date(top.updateTime), 'MM月dd日') }}更新</span>
      </span>
      <strong class="topname">{{ top.name }}</strong>
      <ul class="tracks">
        <li class="track_item" v-for="(track, ind) in top.tracks" :key="ind">
          {{ track.first }}
          <span class="er">
            {{ track.second }}
          </span>
        </li>
      </ul>
    </li>
  </ul>
  <p class="split_title">全球榜</p>
  <ul class="oth_tops">
    <li class="top_item" v-for="(top, index) in tops" :key="index">
      <img :src="top.coverImgUrl" :alt="top.name">
      <span class="count">{{ top.playCount }}</span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { topsApi } from '@/api';
import { ref, onBeforeMount } from 'vue'
import { dateFormat } from '@/utils'

interface itemInt {
  [key: string]: any
}

const mainTops = ref<itemInt[]>([])
const tops = ref<itemInt[]>([])

onBeforeMount(async () => {
  await topsApi.about().then(res => {
    if (res.code == 200) {
      res.list.forEach((v: any, ind: number) => {
        if (ind < 4) {
          mainTops.value.push(v)
        } else {
          tops.value.push(v)
        }
      })
    }
  })
})
</script>
<style lang="scss" scoped>
.main_tops {
  overflow: hidden;
  .top_item {
    float: left;
    width: calc(50% - 10px);
    margin: 10px 0;
    overflow: hidden;
    background-color: $somegrey;
    border-radius: 4px;
    &:nth-of-type(even) {
      margin-left: 20px;
    }
    .topname{
      display: block;
      padding: 25px 0 15px;
      font-size: 22px;
    }
    .tracks {
      height: 5em;
      overflow: hidden;
      line-height: 1.8;
      color: $textlight;
      .track_item {
        height: 1.8em;
        padding-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        i {
          font-style: normal;
        }
      }
    }
  }
  .cover {
    float: left;
    width: 10rem;
    height: 10rem;
    margin-right: 15px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .info {
      position: absolute;
      right: 15px;
      bottom: 10px;
      color: #fff;
    }
  }
}
.split_title {
  padding: 15px 0 10px;
  font: {
    size: 16px;
    weight: 500;
  };
}
.oth_tops {
  overflow: hidden;
  .top_item {
    float: left;
    position: relative;
    width: calc(20% - 12px);
    margin: 0 15px 20px 0;
    overflow: hidden;
    border-radius: 4px;
    &:nth-of-type(5n) {
      margin-right: 0;
    }
    img {
      width: 100%;
      height: auto;
    }
    .count {
      position: absolute;
      right: 15px;
      bottom: 15px;
      padding: 4px 10px;
      background-color: rgba(0, 0, 0, .4);
      border-radius: 16px;
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
