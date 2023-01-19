<template>
  <SideBar />
  <div id="main">
    <TopBar />
    <div class="contain">
      <router-view></router-view>
    </div>
    <PlayBar />
    <PlayFace />
  </div>
</template>
<script setup lang="ts">
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
import PlayBar from './components/PlayBar.vue'
import PlayFace from './components/Modals/PlayFace.vue'
</script>
