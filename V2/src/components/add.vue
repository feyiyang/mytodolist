<template>
  <input type="text" v-model="whatever"><button :disabled="!whatever" @click="add">添加</button>
</template>
<script>
export default {
  data () {
    return {
      whatever: ''
    }
  },
  methods: {
    add (e) {
      if (!this.whatever) return
      this.whatever = ''
      this.$emit('add', this.whatever)
    },
  }
}
</script>