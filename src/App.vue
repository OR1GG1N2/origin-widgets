<script setup lang="ts">
</script>

<template>
  <nav style="padding: 10px; background-color: #f0f0f0; margin-bottom: 20px;">
    <router-link to="/" style="margin-right: 15px;">Главная</router-link>
    <router-link to="/about">О проекте</router-link>
  </nav>
  <router-view />
</template>

<style scoped>
a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}

a.router-link-active {
  color: #35495e;
}
</style>
