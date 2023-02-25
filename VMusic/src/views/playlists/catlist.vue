<template>
  <div class="content" @click="showCats = false">
    <div class="tags">
      <a-button class="btn_show" size="mini" @click.stop="showCats = !showCats"
        >{{ curCat }}&ensp;<icon-right
      /></a-button>
      <a-space class="cats">
        <a-tag
          v-for="(c, index) in hotcats"
          :key="index"
          :class="{
            isactive: c.name === curCat,
            istag: true
          }"
          @click="clkCat(c)"
          >{{ c.name }}</a-tag
        >
      </a-space>
    </div>
    <div class="all_cats" v-if="showCats" @click.stop="">
      <div class="top">
        <span class="all" @click="clkCat({ name: '全部歌单', id: 0 })"
          >全部歌单</span
        >
        <span class="hot">精品歌单<icon-right /></span>
      </div>
      <div class="cat" v-for="(c, index) in allCats" :key="index">
        <strong class="dt">{{ c.categories }}</strong>
        <ul class="dds">
          <li v-for="(sub, index) in c.sub" :key="index" @click="clkCat(sub)">
            <span :class="{ isactive: sub.name === curCat }">{{
              sub.name
            }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="lists">
      <div class="cover_item" v-for="(item, index) in lists" :key="index">
        <div class="cover" @click="golist(item)">
          <span class="count"
            ><icon-play-arrow class="parrow" /> {{ nunberFmt(item) }}</span
          >
          <img
            class="cover_img"
            :src="`${item.coverImgUrl}?param=250y250`"
            object-fit="contain"
            :alt="item.name"
          />
          <span class="hover">
            <icon-play-circle-fill class="playicon" />
          </span>
        </div>
        <p class="description" @click="golist(item)">{{ item.name }}</p>
        <p class="extra">{{ item?.creator?.nickname }}</p>
      </div>
    </div>
    <div class="load_more">
      <icon-loading v-if="loadMoreTxt === '加载中...'" />
      <p v-if="loadMoreTxt !== '没有更多了'">
        <span class="loadtxt" @click="hdlLoadMore">{{ loadMoreTxt }}</span
        >&emsp;
        <span v-if="total" class="total">(总共:{{ total }})</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { songsApi } from '@/api'
import { countFormat } from '@/utils'

interface catInt {
  activity?: boolean
  category?: number
  createTime?: number
  hot?: boolean
  id: number
  name: string
}
type listItem = {
  id: number
  coverImgUrl?: string
  name: string
  playCount: number | string
  [key: string]: any
}

const router = useRouter()
const hotcats = ref<catInt[]>([])
const offset = ref<number>(0)
const limit = ref<number>(52)
const showCats = ref<boolean>(false)
const curCat = ref<string>('全部歌单')
const allCats = ref<{ categories: string; sub: any[] }[]>([])
const lists = ref<any[]>([])
const loadMoreTxt = ref<string>('加载中...')
const total = ref<number>(0)

onMounted(async () => {
  await songsApi.hotcat().then((res) => {
    if (res.code === 200) {
      hotcats.value = res.tags
    }
  })
  getSongs()
  songsApi.catlist().then((res) => {
    if (res.code === 200) {
      const categories = res.categories
      for (let key in categories) {
        const sub = res.sub.filter((v: any) => {
          return v.category == key
        })
        allCats.value?.push({
          categories: categories[key],
          sub
        })
      }
    }
  })
})
function hdlLoadMore() {
  getSongs()
}
function getSongs() {
  loadMoreTxt.value = '加载中...'
  songsApi
    .topsongs({
      offset: offset.value,
      limit: limit.value,
      cat: curCat.value
    })
    .then((res) => {
      if (res.code === 200) {
        lists.value = lists.value.concat(res.playlists)
        if (res.more) {
          offset.value += limit.value
          loadMoreTxt.value = '加载更多'
        } else {
          loadMoreTxt.value = '没有更多了'
        }
        total.value = res.total
      }
    })
    .catch(() => {
      loadMoreTxt.value = '加载错误'
    })
}
function golist(itm: any) {
  router.push({
    path: `/playlists/${itm?.id}`
  })
}
function clkCat(c: catInt): void {
  offset.value = 0
  lists.value = []
  curCat.value = c.name
  total.value = 0
  showCats.value = false
  getSongs()
}
function nunberFmt(item: listItem): string {
  let res: string = item?.playCount + ''
  res = countFormat(res)
  return res
}
</script>
<style lang="scss" scoped>
.isactive {
  color: $mygreen;
}
.content {
  position: relative;
}
.tags {
  display: flex;
}
.cats {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  .istag {
    cursor: pointer;
  }
  :deep(.arco-space-item) {
    justify-self: start;
  }
}
.all_cats {
  padding: 20px 10px;
  position: absolute;
  left: 0;
  top: 30px;
  width: 92%;
  z-index: 2;
  background-color: #fff;
  // border: 1px $mytan solid;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(50, 50, 50, 0.6);
  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .all {
      cursor: pointer;
    }
  }
  .cat {
    display: flex;
    padding: 10px 0;
  }
  .dt {
    width: 70px;
    flex-shrink: 0;
  }
  .dds {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    li {
      width: 15%;
      margin-bottom: 10px;
      white-space: nowrap;
      span {
        cursor: pointer;
      }
    }
  }
}
.lists {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  .cover {
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    .count {
      position: absolute;
      right: 22px;
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
  .cover_item {
    display: flex;
    flex-flow: column;
    width: calc(25% - 15px);
    padding: 6px 0 10px;
    margin-right: 20px;
    cursor: pointer;
    &:nth-of-type(4n) {
      margin: 0;
    }
    img {
      width: 100%;
    }
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
.load_more {
  padding: 20px 0;
  text-align: center;
  p {
    padding: 10px 0;
  }
  .total {
    color: #7e7e7e;
  }
  .loadtxt {
    cursor: pointer;
  }
}
</style>
