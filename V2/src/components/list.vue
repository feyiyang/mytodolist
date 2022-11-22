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
        <span class="status"></span>
        <span class="content">
          {{item.content}}
          <span class="type">{{item.times}}</span>
        </span>
        <span :class="'lev lev_' + item.level"><i class="lefti"></i><i class="righti"></i></span>
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
      setTimeout(() => {
        const item = JSON.parse(JSON.stringify(this.todos.splice(index, 1)))
        this.donelist = this.donelist.concat(item)
      }, 400)
      setTimeout(() => { 
        const len = this.donelist.length
        this.donelist[len - 1].status = 'done'
      }, 450)
    }
  }
}
</script>