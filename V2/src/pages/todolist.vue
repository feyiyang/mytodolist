<template>
  <div class="todo_wrap">
    <img class="seven" src="../assets/seven.svg" alt="">
    <div class="aday" v-once>
      <h4>我的一天</h4>
      <p>{{aday}}</p>
    </div>
    <Add @add="addHandler"></Add>
    <List :todos="todos"></List>
    <div class="rightbar">
      <strong>{{taskDet.title}}</strong>
    </div>
  </div>
</template>
<script>
import Add from '../components/add.vue'
import List from '../components/list.vue'
import { dateFormat } from '../assets/utils'
import '../assets/style.less'
export default {
  components: {
    Add,
    List
  },
  data () {
    return {
      todos: [],
      taskDet: {
        title: ''
      },
      aday: '',  // 我的一天
    }
  },
  created () {
    this.aday = dateFormat(new Date(), 'MM月dd号 w')
  },
  methods: {
    addHandler (doitem) {
      const len = this.todos.length
      this.todos.push({ content: doitem, status: 'init', level: 1, times: '' })
      setTimeout(() => {
        this.todos[len].status = 'will'
      }, 60)
    }
  }
}
</script>