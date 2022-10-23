<template>
<div class="demo">
  <todolist></todolist>
</div>
</template>
<script>
import todolist from './pages/todolist.vue'
export default {
  components: {
    todolist
  },
  data () {
    return {
      todos: []
    }
  },
  methods: {
    done(index){
      console.log(index)
      this.todos[index].status = 'done'
    }
  },
}
</script>
<style lang="less">
// 重置样式
*{
  margin: 0;
  padding: 0;
}
input, button{
  vertical-align: middle;
}
li{
  list-style: none;
  line-height: 16px;
}
  @donecolor: #999;
.demo {
  color: #333;
  padding: 1em;
  input{
    border: 1px solid #999;
    border-radius: 4px;
    padding: 0.2em 0.6em;
    background: transparent;
    transition: background-color .5s;
  }
  button {
    cursor: pointer;
  }
  li{
    opacity: 1;
    transition: background-color .5s;
    padding: 4px;
    span{
      display: inline-block;
      vertical-align: middle;
      height: 16px;
      &.status{
        position: relative;
        width: 12px;
        height: 12px;
        margin-right: 4px;
        border: 1px #529394 solid;
        border-radius: 8px;
        cursor: pointer;
      }
    }
    &.done { 
      color: @donecolor;
      .status{
        border-color: @donecolor;
        background-color: #c0c0c0;
        &::before{
          content: ' ';
          position: absolute;
          left:2px;
          top: 5px;
          width: 10px;
          border-bottom: 1px #e3e3e3 solid;
        }
      }
    }
  }
}
</style>
