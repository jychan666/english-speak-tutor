<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.main-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
</style>
