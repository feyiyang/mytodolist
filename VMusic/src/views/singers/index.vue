<template>
  <div class="types" v-for="(type, index) in types" :key="index">
    <span class="name">{{ type.value }}: </span>
    <ul class="items">
      <li class="item" v-for="(item, ind) in type.list" :key="ind" @click="typeChg(type, ind)">
        <span class="val" :class="{'active': ind === currentTypes[type.name]}">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import {singerApi} from '@/api'

interface singerTypeInt {
  name: string
  value: string
  list: Array<{ key: string, value: string }>
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
    list: [
      { key: '-1', value: '热门' },
      ...strKeys(),
      {key: '0', value: '#'}
    ]
  }
])
const currentTypes = reactive<{[key: string]: number}>({
  area: 0,
  type: 0,
  initial: 0
})
const loading = ref<boolean>(false)
const curPage = ref<number>(0)
const perPage = ref<number>(30)

onBeforeMount(async () => {
  await getSingers()
})

async function getSingers() {
  loading.value = true
  const opts = {
    limit: perPage.value,
    offset: perPage.value * curPage.value,
    type: types.value[1].list[currentTypes.type].key,
    area: types.value[0].list[currentTypes.area].key,
    initial: types.value[2].list[currentTypes.initial].key
  }
  await singerApi.list(opts).then(res => {
    console.log(res)
  }).finally(() => {
    loading.value = false
  })
}
function strKeys() {
  let arr:{key: string, value: string}[] = []
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(v => {
    arr.push({ key: v, value: v })
  })
  return arr
}
function typeChg(type: singerTypeInt, ind: number) {
  if (loading.value) return
  currentTypes[type.name] = ind
  getSingers()
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
  &:last-of-type {
    .item {
      width: 56px;
      margin-bottom: 6px;
    }
  }
}
</style>