<template>
  <div class="add_wrap">
    <div class="text">
      <span class="cir"></span>
      <input v-model="whatever" type="text" placeholder="添加任务">
    </div>
    <div class="handlers">
      <button :disabled="!whatever" @click="add">添加</button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      whatever: ''
    }
  },
  emits: ['add'],
  methods: {
    add (e) {
      if (!this.whatever) return
      this.$emit('add', { content: this.whatever, status: 'will' })
      this.whatever = ''
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