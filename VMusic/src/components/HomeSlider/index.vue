<template>
  <div :class="['block_list', props.customClass ? props.customClass : '']">
    <h4 class="sub_title">{{ props.title }}</h4>
    <Splide class="list_squre" :options="props.options">
      <SplideSlide
        class="squre_item"
        v-for="(item, index) in props.list"
        :key="index"
        @click="itemClick(item)"
      >
        <div class="cover">
          <span class="count"
            ><icon-play-arrow class="parrow" /> {{ nunberFmt(item) }}</span
          >
          <img class="cover_img" :src="item.picUrl" :alt="item.name" />
          <span class="hover">
            <icon-play-circle-fill class="playicon" />
          </span>
        </div>
        <p class="description">{{ item.name }}</p>
        <p class="extra">{{ item?.artistName }}</p>
      </SplideSlide>
    </Splide>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { type Options } from '@splidejs/splide'
type listIem = {
  id?: number
  picUrl?: string
  name?: string
  playCount: number | string
  [key: string]: any
}

const router = useRouter()
const props = defineProps<{
  title: string
  type: 'playlists' | 'dj' | 'mv'
  customClass?: string
  options?: Options
  list: listIem[]
}>()
const typeEnums: { [key: string]: (item: listIem) => void } = {
  playlists(item) {
    router.push({
      path: `/playlists/${item?.id}`
    })
  }
}

function nunberFmt(item: listIem): string {
  let res: string =
    (props.type === 'dj' ? item?.program?.listenerCount : item?.playCount) + ''
  if (res.length > 5) {
    res = res.replace(/\d{4}$/, '万')
  }
  return res
}
function itemClick(item: listIem) {
  console.log(typeEnums[props?.type](item), props.type)
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

.block_list {
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
    color: $somegrey;
    line-height: 1.6;
  }
}
.mvlist {
  height: 13.5rem;
  .list_squre {
    .cover_img {
      height: 8.5rem;
    }
  }
}
</style>
