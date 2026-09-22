<script setup>
import BlogHeader from './components/BlogHeader.vue'
import BlogFooter from './components/BlogFooter.vue'
</script>

<template>
  <div id="app">
    <BlogHeader />
    <main class="main-content">
      <router-view />
    </main>
    <BlogFooter />
  </div>
</template>

<style scoped>
  .main-content {
    flex: 1;
    min-height: 60vh;
    padding: 20px 0;
  }
</style>