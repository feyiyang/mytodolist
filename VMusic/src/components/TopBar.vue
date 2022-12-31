<template>
  <div class="topbar">
    <div class="nav_handle">
      <icon-left @click="backHandle" />
      &ensp;
      <icon-right @click="forwardHandle" />
    </div>
    <div class="searchbar">
      <a-input-search
        v-model:value="searchVal"
        :placeholder="defaultKey"
        @focus="dropShow"
        @blur="showDrops = false"
        @search="search"
      ></a-input-search>
      <!-- 热搜、建议 -->
      <div class="drops" v-if="showDrops">
        <!-- <div class="default">
          <span>历史:</span>
          &ensp;<a-tag @click="search(defaultKey)">{{defaultKey}}</a-tag>
        </div> -->
        <div class="hots">
          <strong>热搜:</strong>
          <a-list
            size="small"
            :data="hotLs"
            :bordered="false"
            :loading="hotsLoading"
          >
            <template #item="{ item }">
              <a-list-item @click="search(item.first)">{{
                item.first
              }}</a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchApi } from '@/api'

const router = useRouter()
const searchVal = ref<string>('')
const defaultKey = ref<string>(' ')
const defaultVal = ref<string>('')
const showDrops = ref<boolean>(false)
const hotLs = ref<any[]>([])
const hotsLoading = ref<boolean>(false)

getDefaultKey()

function search(val?: string | undefined): void {
  searchApi
    .search({
      keywords: val || searchVal.value || defaultVal.value
    })
    .then((res: any) => {
      console.log(res)
    })
}
function getDefaultKey(): void {
  searchApi.defaultKey().then((res: any) => {
    // console.log(res)
    defaultKey.value = res.showKeyword
    defaultVal.value = res.realkeyword
  })
}
function dropShow(): void {
  showDrops.value = true
  !hotLs.value.length && getHots()
}
function getHots(): void {
  hotsLoading.value = true
  searchApi.hots().then((res: any) => {
    hotLs.value = res.hots
    hotsLoading.value = false
  })
}
function backHandle(): void {
  router.back()
}
function forwardHandle(): void {
  router.forward()
}
</script>
<style lang="scss" scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 10px 40px;
  align-items: center;
}
.searchbar {
  width: 170px;
}
.drops {
  position: absolute;
  right: 2px;
  top: 50px;
  z-index: 9;
  width: 230px;
  height: 690px;
  padding: 10px;
  border: 2px solid $bgrey;
  background-color: #fff;
  .default {
    padding-bottom: 10px;
  }
  strong {
    font-weight: normal;
  }
}
</style>
