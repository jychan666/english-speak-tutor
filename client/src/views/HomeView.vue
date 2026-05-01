<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/useProgressStore'

const progressStore = useProgressStore()

const practiceBrowserSupported = computed(() => {
  if (typeof navigator === 'undefined') {
    return true
  }
  const ua = navigator.userAgent.toLowerCase()
  const isEdge = ua.includes('edg/')
  const isChrome = ua.includes('chrome/') && !ua.includes('edg/')
  return isChrome || isEdge
})

onMounted(() => {
  progressStore.fetchProgress()
})
</script>

<template>
  <section class="hero card">
    <p class="eyebrow">广东高考英语听说 CELST</p>
    <h1>不只是“练了”，而是“会了”</h1>
    <p class="intro">
      每次练习后都给出可执行诊断，告诉你哪里弱、为什么弱、下一步怎么练。
    </p>
    <div class="hero-actions">
      <router-link class="btn-primary btn-large" to="/learn">快速学习（不开口）</router-link>
      <router-link class="btn-secondary btn-large" to="/practice">去练习（开口训练）</router-link>
    </div>
    <p v-if="!practiceBrowserSupported" class="browser-tip">
      当前浏览器可能不支持语音识别。建议使用 Chrome 或 Edge 进行练习，学习模式不受影响。
    </p>
  </section>

  <section class="overview">
    <article class="card module">
      <h3>🎯 快速学习</h3>
      <p>考前速成、发音突破、语法急救、模板工具箱、场景词汇、实战技巧。</p>
      <router-link to="/learn">进入学习中心 →</router-link>
    </article>
    <article class="card module">
      <h3>🗣 专项练习</h3>
      <p>Part A/B/C 逐项训练，支持实时转写、自动评分和诊断反馈。</p>
      <router-link to="/practice">开始专项练习 →</router-link>
    </article>
    <article class="card module">
      <h3>📈 进度追踪</h3>
      <p>查看历史记录和能力画像，持续追踪发音、语法和复述能力变化。</p>
      <router-link to="/progress">查看我的进度 →</router-link>
    </article>
  </section>

  <section class="stats card">
    <h2>我的近期数据</h2>
    <div class="stats-grid">
      <div>
        <p class="label">总练习次数</p>
        <p class="value">{{ progressStore.totalAttempts }}</p>
      </div>
      <div>
        <p class="label">平均分</p>
        <p class="value">{{ progressStore.avgScore }}</p>
      </div>
      <div>
        <p class="label">最近记录</p>
        <p class="value">{{ progressStore.recentAttempts.length }} 条</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  gap: 14px;
  padding: 28px;
  background:
    radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.15), transparent 32%),
    radial-gradient(circle at 90% 10%, rgba(37, 99, 235, 0.18), transparent 36%),
    var(--color-surface);
}

.eyebrow {
  color: var(--color-primary-dark);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.intro {
  color: var(--color-text-secondary);
  max-width: 680px;
}

.hero-actions {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.browser-tip {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  width: fit-content;
}

.overview {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.module {
  display: grid;
  gap: 10px;
}

.module p {
  color: var(--color-text-secondary);
}

.stats {
  margin-top: 20px;
}

.stats-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.label {
  color: var(--color-text-secondary);
  font-size: 0.92rem;
}

.value {
  margin-top: 2px;
  font-size: 1.6rem;
  font-weight: 800;
}
</style>

