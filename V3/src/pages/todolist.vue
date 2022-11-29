<template>
  <div class="todo_wrap">
    <img class="seven" src="../assets/seven.svg" alt="">
    <div class="aday" v-once>
      <h4>我的一天</h4>
      <p>{{aday}}</p>
    </div>
    <Add @add="addHandler"></Add>
    <List :todos="todos"></List>
  </div>
</template>
<script setup lang="ts">
import {Ref, ref} from 'vue'
import Add from '../components/add.vue'
import List from '../components/list.vue'
import { dateFormat } from '../assets/utils'
import '../assets/style.less'

const todos: Ref<doItem[]> = ref([])
const aday: Ref<string> = ref('')
aday.value = dateFormat(new Date(), 'MM月dd号 w')

function addHandler ({ content, level, ...when }: doItem): void {
  const len: number = todos.value.length
  todos.value.push({ 
    content: content, 
    status: 'newt', 
    level: level, 
    times: (when.week || '') + when.hm
  })
  setTimeout(() => {
    todos.value[len].status = 'will'
  }, 50)
}
</script>