<script setup lang="ts"></script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">🗣</span>
        <span class="logo-text">英语听说提分</span>
      </router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/learn" class="nav-link">快速学习</router-link>
        <router-link to="/practice" class="nav-link">去练习</router-link>
        <router-link to="/progress" class="nav-link">我的进度</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--color-text) !important;
}

.logo-icon {
  font-size: 1.4rem;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>
