<template>
  <todolist></todolist>
</template>
<script setup>
import todolist from './pages/todolist.vue'
</script>
<style lang="less">
// 重置样式
*{
  margin: 0;
  padding: 0;
}
html, body, #app {
  height: 100%;
  overflow: hidden;
  font-size: 14px;
}
input, button{
  color: #333;
  vertical-align: middle;
  user-select: text;
  outline: none;
}
li{
  list-style: none;
  line-height: 16px;
}
</style>
