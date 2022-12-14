<template>
  <div class="home">
    <strong class="title">音乐馆</strong>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="精选"></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref<string>('1')
</script>
<style lang="scss" scoped></style>