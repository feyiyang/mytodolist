<template>
  <side-bar></side-bar>
  <div id="main">
    <top-bar></top-bar>
    <div class="contain">
      <router-view></router-view>
    </div>
    <div class="playbar"></div>
  </div>
</template>
<script setup lang="ts">
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
import { useSpining } from './utils/hooks'
const [spinning] = useSpining()
</script>
