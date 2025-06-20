<script setup>
  import Navbar from './components/Navbar.vue'
  import { RouterView } from 'vue-router';
</script>

<template>
  <div class="layout">
    <nav>
      <Navbar />
    </nav>
    <main>
      <router-view />
    </main>
    <footer>
      <span>© Lopez Urban Farm</span>
      <span class="middot">
        <i class="pi pi-circle-fill"></i>
      </span>
      <router-link to="/login">Login</router-link>
    </footer>
  </div>
</template>

<style scoped>
  .layout{
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    height: 100vh;
    width: 100vw;
  }
  nav{
    height: 50px;
  }
  main{
    flex: 1;
  }
  footer{
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    padding: 10px;
    border-top: 1px solid var(--primary);
    font-size: 1rem;
    color: dimgray;
  }
  footer a{
    color: dimgray;
  }
  footer a:hover{
    text-decoration: underline
  }
  footer .middot{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .5rem;
  }
</style>
