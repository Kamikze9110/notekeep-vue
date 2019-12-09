<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Note msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Note from '@/components/Note.vue'

export default {
  name: 'home',
  components: {
    Note
  }
}
</script>
