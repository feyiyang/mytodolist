<template>
  <div class="add_wrap">
    <div class="text">
      <span class="cir"></span>
      <input type="text" v-model="whatever">
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