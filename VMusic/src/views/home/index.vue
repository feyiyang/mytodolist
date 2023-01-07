<template>
  <a-scrollbar
    outer-class="home"
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
      >
        <a-tab-pane v-for="item in tabs" :key="item.key" :title="item.name">
        </a-tab-pane>
      </a-tabs>
      <router-view></router-view>
    </div>
  </a-scrollbar>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref<string>('1')
const tabs = ref([
  { key: '1', path: '/blocks', name: '精选' },
  { key: '2', path: '/stations', name: '有声电台' },
  { key: '3', path: '/ranks', name: '排行榜' },
  { key: '4', path: '/singers', name: '歌手' },
  { key: '5', path: '/allist', name: '分类歌单' }
])
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
