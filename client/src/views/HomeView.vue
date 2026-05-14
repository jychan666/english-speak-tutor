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

const hasData = computed(() => progressStore.totalAttempts > 0)

onMounted(() => {
  progressStore.fetchProgress()
})
</script>

<template>
  <div class="home-container">
    <!-- ========== Hero 区 ========== -->
    <section class="hero">
      <div class="hero-left">
        <p class="hero-eyebrow">广东高考英语听说 CELST</p>
        <h1 class="hero-title">不只是"练了"<br />而是"会了"</h1>
        <p class="hero-desc">
          每次练习后都给出可执行诊断，告诉你哪里弱、为什么弱、下一步怎么练。
        </p>
        <div class="hero-actions">
          <router-link class="btn-primary btn-large hero-primary-btn" to="/practice">
            去练习
            <span class="btn-sub">开口训练 + 实时评分</span>
          </router-link>
          <router-link class="btn-secondary btn-large hero-secondary-btn" to="/learn">
            快速学习
            <span class="btn-sub">不开口也能提分</span>
          </router-link>
        </div>
      </div>
      <div class="hero-right" aria-hidden="true">
        <div class="hero-graphic">
          <div class="hero-ring hero-ring--outer"></div>
          <div class="hero-ring hero-ring--mid"></div>
          <div class="hero-ring hero-ring--inner"></div>
          <span class="hero-emoji">🎯</span>
        </div>
      </div>
    </section>

    <!-- 浏览器提示 -->
    <div v-if="!practiceBrowserSupported" class="browser-tip">
      <span class="browser-tip-icon">&#9888;</span>
      <span>当前浏览器可能不支持语音识别。建议使用 <strong>Chrome</strong> 或 <strong>Edge</strong> 进行练习，学习模式不受影响。</span>
    </div>

    <!-- ========== 模块卡片 ========== -->
    <section class="modules">
      <div class="module-grid">
        <article class="card module-card module-card--hero">
          <div class="module-emoji">🗣</div>
          <h3>专项练习</h3>
          <p>Part A/B/C 逐项训练，支持实时转写、自动评分和诊断反馈。</p>
          <router-link class="module-link" to="/practice">
            开始专项练习
            <span class="arrow">&rarr;</span>
          </router-link>
        </article>
        <article class="card module-card">
          <div class="module-emoji">🎯</div>
          <h3>快速学习</h3>
          <p>高考速成、发音突破、语法急救、模板工具箱、场景词汇、实战技巧。</p>
          <router-link class="module-link" to="/learn">
            进入学习中心
            <span class="arrow">&rarr;</span>
          </router-link>
        </article>
        <article class="card module-card">
          <div class="module-emoji">📈</div>
          <h3>进度追踪</h3>
          <p>查看历史记录和能力画像，持续追踪发音、语法和复述能力变化。</p>
          <router-link class="module-link" to="/progress">
            查看我的进度
            <span class="arrow">&rarr;</span>
          </router-link>
        </article>
      </div>
    </section>

    <hr class="section-divider" />

    <!-- ========== 数据区 ========== -->
    <section class="stats-section">
      <h2 class="stats-heading">我的近期数据</h2>

      <!-- 有数据 -->
      <div v-if="hasData" class="stats-grid">
        <div class="stat-item">
          <p class="stat-value">{{ progressStore.totalAttempts }}</p>
          <p class="stat-label">总练习次数</p>
        </div>
        <div class="stat-item">
          <p class="stat-value">{{ progressStore.avgScore }}</p>
          <p class="stat-label">平均分</p>
        </div>
        <div class="stat-item">
          <p class="stat-value">{{ progressStore.recentAttempts.length }}</p>
          <p class="stat-label">最近记录</p>
        </div>
      </div>

      <!-- 空态 -->
      <div v-else class="stats-empty">
        <p class="stats-empty-icon">📋</p>
        <p class="stats-empty-text">还没有练习记录，开始第一次练习吧</p>
        <router-link class="btn-primary" to="/practice">开始练习</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md) var(--space-3xl);
  display: grid;
  gap: var(--space-xl);
}

/* ======== Hero 区 ======== */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
  padding: var(--space-2xl) var(--space-xl);
  background:
    radial-gradient(circle at 15% 30%, rgba(15, 118, 110, 0.06), transparent 45%),
    radial-gradient(circle at 85% 70%, rgba(249, 115, 22, 0.05), transparent 40%),
    var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.hero-left {
  display: grid;
  gap: var(--space-md);
}

.hero-eyebrow {
  color: var(--color-primary-dark);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-title {
  font-size: var(--text-hero);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.hero-desc {
  color: var(--color-text-secondary);
  max-width: 480px;
  font-size: var(--text-lg);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.hero-primary-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 32px;
  font-size: var(--text-lg);
  line-height: 1.3;
}

.hero-secondary-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px 24px;
  font-size: var(--text-base);
  line-height: 1.3;
}

.btn-sub {
  font-size: var(--text-xs);
  font-weight: 400;
  opacity: 0.8;
  margin-top: 2px;
}

/* ======== Hero 图形 ======== */
.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-graphic {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}

.hero-ring--outer {
  width: 100%;
  height: 100%;
  opacity: 0.12;
}

.hero-ring--mid {
  width: 70%;
  height: 70%;
  border-style: dashed;
  opacity: 0.2;
}

.hero-ring--inner {
  width: 40%;
  height: 40%;
  opacity: 0.35;
  background: rgba(15, 118, 110, 0.06);
}

.hero-emoji {
  font-size: 3.5rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(15, 118, 110, 0.15));
}

/* ======== 浏览器提示 ======== */
.browser-tip {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fdba74;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.browser-tip-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* ======== 模块卡片 ======== */
.modules {
  margin-top: var(--space-sm);
}

.module-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: var(--space-md);
}

.module-card {
  display: grid;
  gap: var(--space-sm);
  padding: var(--space-lg);
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
  cursor: default;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.module-card--hero {
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.03) 0%, transparent 50%),
    var(--color-surface);
}

.module-emoji {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: var(--space-xs);
}

.module-card h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
}

.module-card p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.7;
}

.module-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--text-sm);
  margin-top: var(--space-xs);
  transition: gap var(--duration-fast) var(--ease-out-expo);
}

.module-link:hover {
  gap: 8px;
}

.arrow {
  transition: transform var(--duration-fast) var(--ease-out-expo);
}

.module-link:hover .arrow {
  transform: translateX(2px);
}

/* ======== 分隔线 ======== */
.section-divider {
  height: 1px;
  background: var(--color-border);
  border: none;
  margin: var(--space-sm) 0;
}

/* ======== 数据区 ======== */
.stats-section {
  display: grid;
  gap: var(--space-lg);
}

.stats-heading {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stat-label {
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}

/* ======== 空态 ======== */
.stats-empty {
  display: grid;
  gap: var(--space-md);
  justify-items: center;
  text-align: center;
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl) var(--space-lg);
}

.stats-empty-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stats-empty-text {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  max-width: 320px;
}

/* ======== 响应式 ======== */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    padding: var(--space-lg);
  }

  .hero-right {
    order: -1;
  }

  .hero-graphic {
    width: 140px;
    height: 140px;
  }

  .hero-emoji {
    font-size: 2.5rem;
  }

  .hero-title {
    font-size: clamp(1.6rem, 5vw, 2rem);
  }

  .module-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
  }

  .stat-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: var(--space-md) var(--space-sm) var(--space-2xl);
    gap: var(--space-md);
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-primary-btn,
  .hero-secondary-btn {
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
  }

  .stat-value {
    font-size: 1.6rem;
  }
}
</style>
