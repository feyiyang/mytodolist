<template>
  <a-config-provider :locale="zhCN">
    <side-bar></side-bar>
    <div id="main">
      <top-bar></top-bar>
      <div class="contain">
        <router-view></router-view>
      </div>
      <div class="playbar"></div>
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
</script>
