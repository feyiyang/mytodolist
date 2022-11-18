<template>
  <ul class="todos">
    <li v-for="(item, index) in todos" :key="index" :class="item.status">
      <span class="status" title="点击完成" @click="done(index)"></span>
      <span class="content">
        {{item.content}}
        <span class="type">任务<i :class="'lev_' + item.level"></i></span>
      </span>
    </li>
  </ul>
  <template v-if="donelist.length">
    <span class="donet">已完成◿</span>
    <ul class="todos done">
      <li v-for="(item, index) in donelist" :key="index" :class="item.status">
        <span class="status"></span>
        <span class="content">
          {{item.content}}
          <span class="type">任务</span>
        </span>
      </li>
    </ul>
  </template>
</template>
<script>
export default {
  props: {
    todos: Array
  },
  data () {
    return {
      donelist: []
    }
  },
  methods: {
    done(index){
      this.todos[index].status = 'init'
      const item = JSON.parse(JSON.stringify(this.todos.splice(index, 1)))
      const len = this.donelist.length
      this.donelist = this.donelist.concat(item)
      setTimeout(() => {
        this.donelist[len].status = 'done'
      }, 40)
    }
  }
}
</script>