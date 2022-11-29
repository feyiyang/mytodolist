<template>
  <ul class="todos">
    <li v-for="(item, index) in todos" :key="index" :class="item.status">
      <span class="status" title="点击完成" @click="done(index)"></span>
      <span class="content">
        {{item.content}}
        <span class="type">{{item.times}}</span>
      </span>
      <span :class="'lev lev_' + item.level"><i class="lefti"></i><i class="righti"></i></span>
    </li>
  </ul>
  <template v-if="donelist.length">
    <span class="donet">已完成◿</span>
    <ul class="todos donels">
      <li v-for="(item, index) in donelist" :key="index" :class="item.status">
        <span class="status" @click="delDone(index)"></span>
        <span class="content">
          {{item.content}}
          <span class="type">{{item.times}}</span>
        </span>
        <span :class="'lev lev_' + item.level"><i class="lefti"></i><i class="righti"></i></span>
      </li>
    </ul>
  </template>
</template>
<script setup lang="ts">
import {Ref, ref, defineProps} from 'vue'
const props = defineProps<{ todos: doItem[] }>()
const donelist: Ref<doItem[]> = ref([])

function done (index: number): void {
  props.todos[index].status = 'init'
  setTimeout(() => {
    const item: doItem = JSON.parse(JSON.stringify(props.todos.splice(index, 1)))
    donelist.value = donelist.value.concat(item)
  }, 400)
  setTimeout(() => { 
    const len: number = donelist.value.length
    donelist.value[len - 1].status = 'done'
  }, 450)
}
function delDone (index: number): void {
  donelist.value.splice(index, 1)
}
</script>