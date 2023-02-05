<template>
  <a-scrollbar
    outer-class="home"
    class="main_scroller"
    :outer-style="{ width: '100%', height: '100%', overflow: 'hidden auto' }"
    style="padding: 0 40px; height: 100%; overflow: hidden auto"
  >
    <div class="content">
      <strong class="title">音乐馆</strong>
      <a-tabs
        v-model:activeKey="activeKey"
        class="home_tabs"
        size="small"
        :tabBarGutter="20"
        :headerPadding="false"
        @tab-click="tabChg"
      >
        <a-tab-pane v-for="(item, key) of tabs" :key="key" :title="item.name">
        </a-tab-pane>
      </a-tabs>
      <router-view></router-view>
    </div>
  </a-scrollbar>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tabs = reactive<{ [key: string]: { alias?: string[]; name: string } }>({
  '/': { name: '精选', alias: ['/'] },
  // '/stations': { name: '有声电台' },
  '/toplists': { name: '排行榜' },
  '/singers': { name: '歌手' },
  '/catlist': { name: '分类歌单' }
})
const activeKey = ref<string>(tabs[route.path] ? route.path : '')

function tabChg(key: string | number) {
  router.push(key as string)
}
</script>
<style lang="scss" scoped>
.home {
  // height: 100%;
  // overflow: hidden auto;
  &_tabs {
    position: sticky;
    top: 0;
    z-index: 3;
    background-color: #fff;
  }
  > .content {
    width: 100%;
    overflow-x: hidden;
  }
}
strong.title {
  display: block;
  font: {
    size: 22px;
    weight: normal;
  }
  padding-bottom: 10px;
}
</style>
