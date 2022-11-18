<template>
  <div class="add_wrap">
    <div class="text">
      <span class="cir"></span>
      <input v-model="content" type="text" placeholder="添加任务">
    </div>
    <div class="handlers">
      <div class="times">
        <button>频次</button>
        <ul class="times">
          <li>周一</li>
          <li>周二</li>
          <li>周三</li>
          <li>周四</li>
          <li>周五</li>
          <li>周六</li>
          <li>周日</li>
        </ul>
      </div>
      <button :disabled="!content" @click="add">添加</button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      content: ''
    }
  },
  emits: ['add'],
  methods: {
    add () {
      if (!this.content) return
      this.$emit('add', this.content)
      this.content = ''
    },
  }
}
</script>
<style lang="less" scoped>
button {
  height: 26px;
  color: #2532a3;
  font-weight: 600;
  border: 1px #ccc solid;
  background-color: #fff;
  &:disabled {
    color: #999;
  }
}
</style>