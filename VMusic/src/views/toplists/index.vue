<template>
  <a-spin :loading="loading">
    <ul class="main_tops">
      <li
        v-for="(top, index) in mainTops"
        :key="index"
        class="top_item"
        @click="goplaylist(top)"
      >
        <span class="cover">
          <img :src="top.coverImgUrl" :alt="top.name" object-fit="cover" />
          <span class="info"
            >{{ dateFormat(new Date(top.updateTime), 'MM月dd日') }}更新</span
          >
          <span class="hov">
            <icon-play-circle-fill class="ico" />
          </span>
        </span>
        <strong class="topname">{{ top.name }}</strong>
        <ul class="tracks">
          <li class="track_item" v-for="(track, ind) in top.tracks" :key="ind">
            {{ track.first }} -
            <span class="er">
              {{ track.second }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
    <p class="split_title">全球榜</p>
    <ul class="oth_tops">
      <li
        class="top_item"
        v-for="(top, index) in tops"
        :key="index"
        @click="goplaylist(top)"
      >
        <img :src="top.coverImgUrl" :alt="top.name" />
        <span class="count"
          ><icon-play-arrow /> {{ countFormat(top.playCount) }}</span
        >
        <span class="hov">
          <icon-play-circle-fill class="ico" />
        </span>
      </li>
    </ul>
  </a-spin>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { topsApi } from '@/api'
import { dateFormat, countFormat } from '@/utils'

interface itemInt {
  [key: string]: any
}

const router = useRouter()
const mainTops = ref<itemInt[]>([])
const tops = ref<itemInt[]>([])
const loading = ref<boolean>(false)

onBeforeMount(async () => {
  loading.value = true
  await topsApi
    .about()
    .then((res) => {
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
    .finally(() => {
      loading.value = false
    })
})

function goplaylist(top: itemInt) {
  router.push(`/playlists/${top.id}`)
}
</script>
<style lang="scss" scoped>
@mixin cover_hover {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  text-align: center;
  .ico {
    margin-top: 50%;
    transform: translateY(-50%);
    font-size: 40px;
  }
}
.main_tops {
  overflow: auto;
  .top_item {
    float: left;
    width: calc(50% - 10px);
    margin: 10px 0;
    overflow: hidden;
    background-color: $somegrey;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    &:nth-of-type(even) {
      margin-left: 20px;
    }
    &:hover {
      transform: translateY(-8px);
      .hov {
        display: block;
      }
    }
    .topname {
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
    position: relative;
    width: 10rem;
    height: 10rem;
    margin-right: 15px;
    cursor: pointer;
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
    .hov {
      @include cover_hover;
    }
  }
}
.split_title {
  padding: 20px 0;
  font: {
    size: 16px;
    weight: 500;
  }
}
.oth_tops {
  overflow: visible;
  .top_item {
    float: left;
    position: relative;
    width: calc(20% - 12px);
    min-height: 4rem;
    margin: 0 15px 20px 0;
    overflow: hidden;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: translateY(-8px);
      .hov {
        display: block;
      }
    }
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
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 16px;
      font-size: 12px;
      color: #fff;
    }
    .hov {
      @include cover_hover;
    }
  }
}
</style>
