<template>
  <Splide class="banner_wrap" :options="bannerOptions">
    <SplideSlide class="carousel_item" v-for="(banner, ind) in banners" :key="ind">
      <img :src="banner.imageUrl" alt="" @click="bannerClick(banner)">
      <span class="type_title" :style="{ backgroundColor: `${banner.titleColor}` }">
        {{banner.typeTitle}}
      </span>
    </SplideSlide>
  </Splide>
  <home-block title="推荐歌单" custom-class="personalized" :options="listOptions" :list="personalized"></home-block>
  <home-block title="推荐有声电台" custom-class="djlist" type="dj" :countKey="'program.listenerCount'" :options="listOptions" :list="djs"></home-block>
  <home-block title="推荐视频" custom-class="mvlist" type="mv" :options="{perPage: 3,gap:'1rem',autoWidth:true}" :list="mvlist"></home-block>
</template>
<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import { songApi } from '@/api'
import HomeBlock from '@/components/HomeSlider/index.vue'
const homeBlocks = ref<any[]>([])
const width = '100%'
const gap = '1rem'
const bannerOptions = reactive({
  rewind     : true,
  perPage    : 2,
  width      ,
  fixedHeight: '9.8rem',
  gap      
})
const listOptions = reactive({
  lazyLoad: true,
  perPage: 4,
  width,
  fixedHeight: '15rem',
  gap      
})
const banners = ref<any[]>([])
const personalized = ref<any[]>([])
const djs = ref<any[]>([])
const mvlist = ref<any[]>([])

onMounted(async () => {
  await songApi.banner().then((res: any) => {
  // console.log(res)
    banners.value = res.banners
  })
  await songApi.personalized().then((res: any) => {
    personalized.value = res
  })
  await songApi.djprogram().then((res: any) => {
    djs.value = res
  })
  await songApi.mvprogram().then((res: any) => {
    mvlist.value = res
  })

  // await songApi.homeBlocks().then((res: any) => {
  //   const {blocks} = res
  //   homeBlocks.value.push(...blocks)
  // })
})


function bannerClick (banner: any): void {
  console.log(banner)
  if (banner.url) {
    window.open(banner.url)
  }
}

</script>
<style lang="scss" scoped>
.banner_wrap{
  height: 12rem;
  .carousel_item{
    height: 9.6rem;
    border-radius: 4px;
    overflow: hidden;
  }
  img{
    width: 100%;
    height: 100%;
  }
  .type_title{
    position: absolute;
    right: 0;
    top: 4px;
    padding: 4px 8px 6px 14px;
    overflow: hidden;
    border-radius: 12px 0 0 12px;
    font-size: 10px;
    font-weight: normal;
    color: #fff;
    opacity: .8;
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