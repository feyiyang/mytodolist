<template>
  <div class="topbar">
    <div class="searchbar">
      <IxInput v-model:value="searchVal">
        <template #addonAfter><IxIcon name="search" @click="search" /></template>
      </IxInput>
      <!-- 热搜、建议 -->
      <div class="drops" v-if="showDrops"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
import { searchApi } from '@/api'

const searchVal: Ref<string> = ref('')
const showDrops: Ref<boolean> = ref(false)

function search() {
  searchApi.search({
    keywords: searchVal
  }).then((res: any) => {
    console.log(res)
  })
}

</script>