<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/useProgressStore'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const progressStore = useProgressStore()

const skillRows = computed(() => [
  { label: '发音', value: progressStore.skillProfile.pronunciation },
  { label: '流利度', value: progressStore.skillProfile.fluency },
  { label: '语法', value: progressStore.skillProfile.grammar },
  { label: '词汇', value: progressStore.skillProfile.vocabulary },
  { label: '内容复述', value: progressStore.skillProfile.contentRetention },
])

const radarData = computed(() => ({
  labels: skillRows.value.map((s) => s.label),
  datasets: [
    {
      label: '能力值',
      data: skillRows.value.map((s) => s.value),
      backgroundColor: 'rgba(15, 118, 110, 0.2)',
      borderColor: '#115e59',
      borderWidth: 2,
      pointBackgroundColor: '#115e59',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}))

const radarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 10,
      cornerRadius: 6,
      displayColors: false,
      callbacks: {
        label: (ctx: any) => `${ctx.raw} 分`,
      },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        backdropColor: 'transparent',
        color: '#9ca3af',
        font: { size: 11 },
      },
      pointLabels: {
        color: '#1f2937',
        font: { size: 13, weight: '600' as const },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.06)',
      },
      angleLines: {
        color: 'rgba(0, 0, 0, 0.06)',
      },
    },
  },
}))

onMounted(async () => {
  await progressStore.fetchProgress()
  await progressStore.fetchSkillProfile()
})
</script>

<template>
  <!-- ===== 页面头部 ===== -->
  <div class="page-head">
    <h1>我的进度</h1>
    <p class="text-secondary">查看历史记录、能力画像和近期表现趋势</p>
  </div>

  <!-- ===== 统计卡片 ===== -->
  <div class="stats-row">
    <div class="stat-item">
      <p class="stat-number">{{ progressStore.totalAttempts }}</p>
      <p class="stat-label">总练习次数</p>
    </div>
    <div class="stat-item">
      <p class="stat-number">{{ progressStore.avgScore }}</p>
      <p class="stat-label">平均得分</p>
    </div>
    <div class="stat-item">
      <p class="stat-number">{{ progressStore.recentAttempts.length }}</p>
      <p class="stat-label">最近记录</p>
    </div>
  </div>

  <!-- ===== 能力画像 ===== -->
  <div class="skill-section">
    <h2>能力画像</h2>
    <div class="radar-wrap">
      <Radar :data="radarData" :options="radarOptions" />
    </div>
    <div class="skill-bars">
      <div v-for="item in skillRows" :key="item.label" class="skill-row">
        <span class="skill-label">{{ item.label }}</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: `${item.value}%` }"
          ></div>
        </div>
        <span class="skill-value">{{ item.value }}</span>
      </div>
    </div>
  </div>

  <!-- ===== 练习历史 ===== -->
  <div class="history-section">
    <h2>练习历史</h2>
    <div v-if="progressStore.recentAttempts.length" class="history-list">
      <router-link
        v-for="attempt in progressStore.recentAttempts"
        :key="attempt.id"
        :to="{ name: 'result', params: { attemptId: attempt.id } }"
        class="history-row"
      >
        <div class="history-left">
          <p class="history-date">{{ new Date(attempt.date).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</p>
          <span :class="['history-tag', attempt.mode === 'mock' ? 'history-tag--mock' : 'history-tag--practice']">
            {{ attempt.mode === 'mock' ? '模拟考试' : '专项练习' }}
          </span>
        </div>
        <div class="history-right">
          <span class="history-score">{{ attempt.totalScore }} 分</span>
          <span class="history-duration">{{ attempt.totalDuration }} 秒</span>
        </div>
      </router-link>
    </div>
    <div v-else class="empty-block">
      <p class="text-secondary empty-msg">还没有练习记录，先去完成一次训练吧</p>
      <router-link class="btn-primary" to="/practice">开始练习</router-link>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面头部 ===== */
.page-head {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-xs);
}

/* ===== 统计卡片 ===== */
.stats-row {
  margin-top: var(--space-md);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.stat-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  background: var(--color-surface);
  display: grid;
  gap: var(--space-xs);
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.1;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* ===== 能力画像 ===== */
.skill-section {
  margin-top: var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-lg);
}

.radar-wrap {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.skill-bars {
  display: grid;
  gap: 10px;
}

.skill-row {
  display: grid;
  grid-template-columns: 80px 1fr 36px;
  gap: var(--space-sm);
  align-items: center;
}

.skill-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.bar-track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e7eb;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--color-primary);
  transition: width var(--duration-slow) var(--ease-out-expo);
}

.skill-value {
  font-size: var(--text-sm);
  font-weight: 700;
  text-align: right;
  color: var(--color-text);
}

/* ===== 练习历史 ===== */
.history-section {
  margin-top: var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-md);
}

.history-list {
  display: grid;
}

.history-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-border);
  text-decoration: none;
  color: inherit;
  transition: background var(--duration-fast) var(--ease-in-out);
}

.history-row:first-child {
  padding-top: 0;
}

.history-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.history-row:hover {
  background: var(--color-surface-hover);
  margin: 0 calc(-1 * var(--space-md));
  padding-left: var(--space-md);
  padding-right: var(--space-md);
  border-radius: var(--radius-sm);
}

.history-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.history-date {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.history-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 1px 8px;
  border-radius: 999px;
}

.history-tag--mock {
  background: #dcfce7;
  color: #166534;
}

.history-tag--practice {
  background: #dbeafe;
  color: #1e40af;
}

.history-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.history-score {
  font-size: var(--text-base);
  font-weight: 800;
  color: var(--color-text);
}

.history-duration {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* ===== 空态 ===== */
.empty-block {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
  text-align: center;
  padding: var(--space-xl) var(--space-md);
}

.empty-msg {
  font-size: var(--text-sm);
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .radar-wrap {
    max-width: 300px;
  }

  .skill-row {
    grid-template-columns: 64px 1fr 32px;
  }

  .history-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  .history-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

