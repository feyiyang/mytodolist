<template>
  <add @add="addHandler"></add>
</template>
<script>
import add from '../components/add.vue'
export default {
  components: {
    add
  },
  data () {
    return {
      todos: []
    }
  },
  methods: {
    addHandler () {
      this.todos.push({ status: 'will', content: this.whatever })
    }
  }
}
</script>