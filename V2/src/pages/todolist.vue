<template>
  <div class="todo_wrap">
    <div class="aday" v-once>
      <h4>我的一天</h4>
      <p>{{aday}}</p>
    </div>
    <Add @add="addHandler"></Add>
    <List :todos="todos"></List>
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
      aday: ''
    }
  },
  created () {
    this.aday = dateFormat(new Date(), 'MM月dd号 w')
  },
  methods: {
    addHandler (doitem) {
      this.todos.push(doitem)
    }
  }
}
</script>
<style lang="less" scoped>
.aday{
  padding-bottom: 15px;
  h4{
    font-size: 18px;
  }
  p{
    font-size: 12px;
    color: #797979;
  }
}
</style>