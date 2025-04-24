<script setup>
  import Navbar from './components/Navbar.vue'
</script>

<template>
  <nav>
    <Navbar />
  </nav>

  <main>

  </main>
</template>

<style scoped>
  nav{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
  }
  main{
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
