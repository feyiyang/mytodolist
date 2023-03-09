<template>
  <a-spin v-if="loading" class="spin"></a-spin>
  <template v-else>
    <Splide class="banner_wrap" :options="bannerOptions">
      <SplideSlide
        class="carousel_item"
        v-for="(banner, ind) in banners"
        :key="ind"
      >
        <img :src="banner.imageUrl" alt="" @click="bannerClick(banner)" />
        <span
          class="type_title"
          :style="{ backgroundColor: `${banner.titleColor}` }"
        >
          {{ banner.typeTitle }}
        </span>
      </SplideSlide>
    </Splide>
    <home-block
      title="推荐歌单"
      class="personalized"
      type="playlists"
      :options="listOptions"
      :list="personalized"
    ></home-block>
    <home-block
      title="推荐有声电台"
      class="djlist"
      type="dj"
      :countKey="'program.listenerCount'"
      :options="listOptions"
      :list="djs"
    ></home-block>
    <home-block
      title="推荐视频"
      class="mvlist"
      type="mv"
      :options="{ perPage: 3, gap: '1rem' }"
      :list="mvlist"
    ></home-block>
    <home-block
      title="最新发行"
      class="newsonglist"
      type="newsong"
      :options="listOptions"
      :list="newsong"
    >
      <template v-slot="{ item, clickfn }">
        <div class="cover" @click.stop="clickfn.newsong(item, true)">
          <img class="cover_img" :src="item.picUrl" :alt="item.name" />
          <span class="hover">
            <icon-play-circle-fill class="playicon" />
          </span>
        </div>
        <p class="description">{{ item.name }}</p>
        <p class="extra">
          <span class="er" v-for="(er, ind) in item.song.artists" :key="ind">
            {{ er.name }}
          </span>
        </p>
      </template>
    </home-block>
  </template>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { homeApi } from '@/api'
import HomeBlock from '@/components/HomeSlider/index.vue'
// const homeBlocks = ref<any[]>([])
const width = '100%'
const gap = '1rem'
const bannerOptions = reactive({
  rewind: true,
  perPage: 2,
  width,
  fixedHeight: '9.8rem',
  gap
})
const listOptions = reactive({
  lazyLoad: true,
  pagination: false,
  perPage: 4,
  width,
  fixedHeight: '15rem',
  gap
})
const loading = ref<boolean>(true)
const banners = ref<any[]>([])
const personalized = ref<any[]>([])
const djs = ref<any[]>([])
const mvlist = ref<any[]>([])
const newsong = ref<any[]>([])

onBeforeMount(async () => {
  if (banners.value.length && newsong.value.length) return
  await homeApi.banner().then((res: any) => {
    banners.value = res.banners
  })
  await homeApi.personalized().then((res: any) => {
    personalized.value = res
  })
  homeApi
    .djprogram()
    .then((res: any) => {
      djs.value = res
    })
    .finally(() => {
      loading.value = false
    })
  await homeApi.mvprogram().then((res: any) => {
    mvlist.value = res
  })
  homeApi.newsong().then((res: any) => {
    newsong.value = res
  })
})

function bannerClick(banner: any): void {
  console.log(banner)
  if (banner.url) {
    window.open(banner.url)
  }
}
</script>
<style lang="scss" scoped>
.banner_wrap {
  height: 12rem;
  .carousel_item {
    height: 9.6rem;
    border-radius: 4px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .type_title {
    position: absolute;
    right: 0;
    top: 4px;
    padding: 4px 8px 6px 14px;
    overflow: hidden;
    border-radius: 12px 0 0 12px;
    font-size: 10px;
    font-weight: normal;
    color: #fff;
    opacity: 0.8;
    backdrop-filter: blur(12px) brightness(60%) contrast(40%) opacity(80%);
  }
}

:deep(.splide__arrows) {
  .splide__arrow {
    background: none;
    transform: translateY(-2rem);
  }
  .splide__arrow--prev {
    left: -1.6rem;
  }
  .splide__arrow--next {
    right: -1.6rem;
  }
}
</style>

<style lang="scss">
.home_block_list {
  height: 18rem;
  .list_squre {
    .cover {
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
      .count {
        position: absolute;
        right: 14px;
        bottom: 8px;
        padding: 4px 8px 6px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.8);
        font-size: 10px;
        color: #fff;
        .parrow {
          vertical-align: 0;
        }
      }
      .hover {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.6);
        text-align: center;
        line-height: 14rem;
        .playicon {
          font-size: 68px;
          color: #f2f2f2;
          width: 56px;
          opacity: 0.8;
        }
      }
    }
    .cover_img {
      height: 11rem;
      border-radius: 8px;
    }
    .squre_item {
      display: flex;
      flex-flow: column;
      padding-top: 6px;
      cursor: pointer;
      .cover:hover {
        transform: translateY(-6px);
        .count {
          display: none;
        }
        .hover {
          display: block;
        }
      }
    }
  }
  .description {
    padding: 8px 0 0 0;
    line-height: 1.4;
    max-height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    &:hover {
      color: $somegreen;
    }
  }
  .extra {
    font-size: 10px;
    color: $textlight;
    line-height: 1.6;
    .er:not(:last-of-type):after {
      content: '/';
    }
  }
  &.mvlist {
    height: 16rem;
    .list_squre {
      .cover_img {
        height: 8.5rem;
      }
    }
  }
}
.spin {
  text-align: center;
}
</style>
