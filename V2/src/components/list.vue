<template>
  <ul class="todos">
    <li v-for="(item, index) in todos" :key="index" :class="item.status">
      <span class="status" @click="done(index)"></span>
      <span class="content">
        {{item.content}}
        <span class="type">任务</span>
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
      this.todos[index].status = 'done'
      const item = JSON.parse(JSON.stringify(this.todos.splice(index, 1)))
      this.donelist = this.donelist.concat(item)
    }
  }
}
</script>
<style lang="less" scoped>
.todos{
  padding: 15px 0;
  li {
    display: flex;
    align-items: center;
    padding: 10px 8px;
    background-color: #fff;
    .content{
      display: flex;
      flex-flow: column;
    }
  }
}
</style>