<template>
  <ul class="todos">
    <li v-for="(item, index) in todos" :key="index" :class="item.status">
      <span class="status" @click="done(index)"></span>
      <span class="content">{{item.content}}</span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    todos: Array
  },
  data () {
    return {}
  },
  methods: {
    done(index){
      this.todos[index].status = 'done'
    }
  }
}
</script>