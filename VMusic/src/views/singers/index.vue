<template>
  <div
    class="types"
    :class="`types_${index}`"
    v-for="(type, index) in types"
    :key="index"
  >
    <span class="name">{{ type.value }}: </span>
    <ul class="items">
      <li
        class="item"
        v-for="(item, ind) in type.list"
        :key="ind"
        @click="typeChg(type, ind)"
      >
        <span
          class="val"
          :class="{ active: ind === currentTypes[type.name] }"
          >{{ item.value }}</span
        >
      </li>
    </ul>
  </div>
  <ul class="slist">
    <li
      class="sitem"
      v-for="(item, index) in singerList"
      :key="index"
      @click="goDetail(item)"
    >
      <a-image
        class="img"
        :src="item.picUrl + '?param=150y150'"
        :alt="item.name"
        fit="cover"
        :preview="false"
      />
      {{ item.name }}
    </li>
  </ul>
  <div class="load_icon" :hidden="!loading">
    <icon-loading class="ico" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, nextTick } from 'vue'
import { singerApi } from '@/api'
import router from '@/router'

interface kvInt {
  key: string
  value: string
}
interface singerTypeInt {
  name: string
  value: string
  list: kvInt[]
}
interface artistInt {
  id: number
  name: string
  picUrl?: string
}

const types = ref<singerTypeInt[]>([
  {
    name: 'area',
    value: '语种',
    list: [
      { key: '-1', value: '全部' },
      { key: '7', value: '华语' },
      { key: '96', value: '欧美' },
      { key: '8', value: '日本' },
      { key: '16', value: '韩国' },
      { key: '0', value: '其他' }
    ]
  },
  {
    name: 'type',
    value: '分类',
    list: [
      { key: '-1', value: '全部' },
      { key: '1', value: '男歌手' },
      { key: '2', value: '女歌手' },
      { key: '3', value: '乐队' }
    ]
  },
  {
    name: 'initial',
    value: '筛选',
    list: [{ key: '-1', value: '热门' }, ...strKeys(), { key: '0', value: '#' }]
  }
])
const currentTypes = reactive<{ [key: string]: number }>({
  area: 0,
  type: 0,
  initial: 0
})
const singerList = ref<artistInt[]>([])
const loading = ref<boolean>(true)
const curPage = ref<number>(0)
const perPage = ref<number>(50)
const isBottom = ref<boolean>(false)
let oshei = 0

onBeforeMount(async () => {
  await getSingers()
})
onMounted(() => {
  var scroller = document.querySelector('.main_scroller') as HTMLElement
  const ohei = scroller.offsetHeight
  scroller.onscroll = function (e) {
    if (isBottom.value || loading.value) return
    if (scroller.scrollTop + ohei + 70 > oshei) {
      isBottom.value = true
      reachBottom()
    }
  }
})

function reachBottom(): void {
  if (loading.value) return
  curPage.value++
  getSingers()
}

async function getSingers(): Promise<any> {
  loading.value = true
  const opts = {
    limit: perPage.value,
    offset: perPage.value * curPage.value,
    type: types.value[1].list[currentTypes.type].key,
    area: types.value[0].list[currentTypes.area].key,
    initial: types.value[2].list[currentTypes.initial].key
  }
  await singerApi
    .list(opts)
    .then((res: any) => {
      if (res.code === 200) {
        singerList.value = singerList.value.concat(res.artists)
        isBottom.value = !res.more
        nextTick(() => {
          var scroller = document.querySelector('.main_scroller') as HTMLElement
          oshei = scroller.scrollHeight
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}
function strKeys(): kvInt[] {
  let arr: kvInt[] = []
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((v) => {
    arr.push({ key: v, value: v })
  })
  return arr
}
function typeChg(type: singerTypeInt, ind: number): void {
  curPage.value = 0
  singerList.value = []
  if (loading.value) return
  currentTypes[type.name] = ind
  getSingers()
}
function goDetail(item: artistInt): void {
  router.push(`/singer/detail/${item.id}`)
}
</script>
<style lang="scss" scoped>
.types {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  font-size: 12px;
  line-height: 1.6;
  .name {
    display: inline-block;
    width: 44px;
    flex-shrink: 0;
  }
  .items {
    overflow: hidden;
  }
  .item {
    position: relative;
    display: inline-block;
    width: 80px;
    text-align: center;
    &:first-of-type {
      width: 56px;
    }
    &::after {
      content: '|';
      position: absolute;
      right: 0;
      top: 0;
      color: #eee;
    }
    .val {
      display: inline-block;
      padding: 0 8px;
      border-radius: 10px;
      cursor: pointer;
      color: #7e777f;
      &:hover {
        color: #333;
      }
    }
    .active {
      background-color: $lightblue;
      color: $somegreen;
    }
  }
  &.types_2 {
    .item {
      width: 56px;
      margin-bottom: 6px;
    }
  }
}
.slist {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .sitem {
    width: calc(20% - 10px);
    margin-bottom: 10px;
    // height: 10.5rem;
    line-height: 2;
    .img {
      width: 100%;
      height: 9rem;
      border-radius: 6px;
    }
  }
}
.load_icon {
  margin: 20px auto;
  text-align: center;
  .ico {
    font-size: 26px;
    color: #999;
  }
}
</style>
