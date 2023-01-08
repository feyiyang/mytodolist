<template>
  <div class="songdet"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { songApi } from '@/api'
const route = useRoute()
onMounted(() => {
  songApi.detail({ ids: route.params.id }).then((res: any) => {
    console.log(res)
  })
})
</script>
<style lang="scss"></style>
