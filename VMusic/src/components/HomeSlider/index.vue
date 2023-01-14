<template>
  <div :class="['home_block_list', props.customClass ? props.customClass : '']">
    <h4 class="sub_title">{{ props.title }}</h4>
    <Splide class="list_squre" :options="props.options">
      <SplideSlide
        class="squre_item"
        v-for="(item, index) in props.list"
        :key="index"
        @click="itemClick(item)"
      >
        <slot :item="item" :clickfn="typeEnums" class="slotttt"></slot>
        <template v-if="!$slots.default">
          <div class="cover">
            <span class="count"
              ><icon-play-arrow class="parrow" /> {{ nunberFmt(item) }}</span
            >
            <img
              class="cover_img"
              :src="item.picUrl + '?param=300y300'"
              :alt="item.name"
            />
            <span class="hover">
              <icon-play-circle-fill class="playicon" />
            </span>
          </div>
          <p class="description">{{ item.name }}</p>
          <p class="extra">{{ item?.artistName }}</p>
        </template>
      </SplideSlide>
    </Splide>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { type Options } from '@splidejs/splide'
import { countFormat } from '@/utils'
import { usePlayer } from '@/utils/hooks'
type listItem = {
  id: number
  picUrl?: string
  name: string
  playCount: number | string
  [key: string]: any
}

const router = useRouter()
const props = defineProps<{
  title: string
  type: 'playlists' | 'dj' | 'mv' | 'newsong'
  customClass?: string
  options?: Options
  list: listItem[]
}>()
const { player: playsongs } = usePlayer()
const { list: queue, current: songInfo } = toRefs(playsongs)
const typeEnums: {
  [key: string]: (item: listItem, isCover?: boolean) => void
} = {
  playlists(item) {
    router.push({
      path: `/playlists/${item?.id}`
    })
  },
  newsong(item, isCover) {
    if (isCover) {
      const song = {
        name: item.name,
        id: item.id,
        ar: item.song.artists,
        al: item.song.album,
        dt: item.song.duration
      }
      queue.value = [song]
      songInfo.value = song
    }
  }
}

function nunberFmt(item: listItem): string {
  let res: string =
    (props.type === 'dj' ? item?.program?.listenerCount : item?.playCount) + ''
  res = countFormat(res)
  return res
}
function itemClick(item: listItem, isCover = false) {
  if (typeEnums[props?.type]) {
    typeEnums[props?.type](item, isCover)
  }
}
</script>
<style lang="scss" scoped>
h4.sub_title {
  font: {
    size: 18px;
    weight: normal;
  }
  padding: 10px 0 10px;
}
</style>
