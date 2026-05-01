<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/useProgressStore'

const progressStore = useProgressStore()

const skillRows = computed(() => [
  { label: '发音', value: progressStore.skillProfile.pronunciation },
  { label: '流利度', value: progressStore.skillProfile.fluency },
  { label: '语法', value: progressStore.skillProfile.grammar },
  { label: '词汇', value: progressStore.skillProfile.vocabulary },
  { label: '内容复述', value: progressStore.skillProfile.contentRetention },
])

onMounted(async () => {
  await progressStore.fetchProgress()
  await progressStore.fetchSkillProfile()
})
</script>

<template>
  <section class="card">
    <h1>我的进度</h1>
    <p class="text-secondary">查看历史记录、能力画像和近期表现趋势。</p>
  </section>

  <section class="summary-grid">
    <article class="card">
      <p class="label">总练习次数</p>
      <p class="value">{{ progressStore.totalAttempts }}</p>
    </article>
    <article class="card">
      <p class="label">平均得分</p>
      <p class="value">{{ progressStore.avgScore }}</p>
    </article>
    <article class="card">
      <p class="label">最近 10 条记录</p>
      <p class="value">{{ progressStore.recentAttempts.length }}</p>
    </article>
  </section>

  <section class="card">
    <h2>能力画像（5 维）</h2>
    <div class="skills">
      <div v-for="item in skillRows" :key="item.label" class="skill-row">
        <span>{{ item.label }}</span>
        <div class="line"><i :style="{ width: `${item.value}%` }"></i></div>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
  </section>

  <section class="card">
    <h2>练习历史</h2>
    <div v-if="progressStore.recentAttempts.length" class="history-list">
      <article class="history-item" v-for="attempt in progressStore.recentAttempts" :key="attempt.id">
        <div>
          <p><strong>{{ attempt.mode === 'mock' ? '模拟考试' : '专项练习' }}</strong></p>
          <p class="text-secondary">{{ new Date(attempt.date).toLocaleString() }}</p>
        </div>
        <div>
          <p class="score">{{ attempt.totalScore }} 分</p>
          <p class="text-secondary">{{ attempt.totalDuration }} 秒</p>
        </div>
      </article>
    </div>
    <p v-else class="text-secondary">还没有练习记录，先去完成一次训练吧。</p>
  </section>
</template>

<style scoped>
.summary-grid {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.label {
  color: var(--color-text-secondary);
}

.value {
  margin-top: 3px;
  font-size: 1.8rem;
  font-weight: 800;
}

.skills {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.skill-row {
  display: grid;
  grid-template-columns: 70px 1fr 42px;
  gap: 8px;
  align-items: center;
}

.line {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.line i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f97316, #f59e0b);
}

.history-list {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.history-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #f8fafc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.score {
  font-size: 1.2rem;
  font-weight: 800;
}
</style>

