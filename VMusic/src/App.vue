<template>
  <SideBar />
  <div id="main">
    <TopBar />
    <div class="contain">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path"></component>
        </keep-alive>
      </router-view>
    </div>
    <PlayBar />
  </div>
</template>
<script setup lang="ts">
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
import PlayBar from './components/PlayBar.vue'
</script>
