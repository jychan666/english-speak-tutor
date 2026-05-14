<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useExamStore } from '@/stores/useExamStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { getAttemptFromCache } from '@/utils/attemptCache'
import type { ExamAttempt, PartResult } from '@/types/scoring'
import { getArticleById } from '@/data/learnArticles'

const props = defineProps<{ attemptId: string }>()
const examStore = useExamStore()
const progressStore = useProgressStore()

const attempt = ref<ExamAttempt | null>(null)
const saveState = ref<'idle' | 'saving' | 'saved'>('idle')
const playbackVisible = ref<Record<'A' | 'B' | 'C', boolean>>({
  A: false,
  B: false,
  C: false,
})

const levelLabel = computed(() => {
  if (!attempt.value) return ''
  if (attempt.value.totalScore >= 85) return '优秀'
  if (attempt.value.totalScore >= 72) return '良好'
  if (attempt.value.totalScore >= 60) return '及格'
  return '需加强'
})

function partMetrics(part: PartResult): Array<{ label: string; value: number }> {
  if ('accuracy' in part.score) {
    return [
      { label: '发音准确度', value: part.score.accuracy },
      { label: '流利度', value: part.score.fluency },
      { label: '语调', value: part.score.intonation },
    ]
  }
  if ('questionGrammar' in part.score) {
    return [
      { label: '提问语法', value: part.score.questionGrammar },
      { label: '提问相关性', value: part.score.questionRelevance },
      { label: '回答准确度', value: part.score.answerAccuracy },
      { label: '回答流利度', value: part.score.answerFluency },
    ]
  }
  return [
    { label: '内容覆盖度', value: part.score.contentCoverage },
    { label: '连贯性', value: part.score.coherence },
    { label: '语言运用', value: part.score.languageUse },
    { label: '流利度', value: part.score.fluency },
  ]
}

async function persistAttempt() {
  if (!attempt.value || saveState.value !== 'idle') {
    return
  }
  saveState.value = 'saving'
  await progressStore.saveAttempt(attempt.value)
  saveState.value = 'saved'
}

function articleRoute(articleId: string) {
  const article = getArticleById(articleId)
  if (!article) {
    return { name: 'learn' as const }
  }
  return {
    name: 'learn-article' as const,
    params: { category: article.category, id: article.id },
  }
}

function recordingUrl(part: 'A' | 'B' | 'C'): string | null {
  return attempt.value?.recordings?.[part] ?? null
}

function togglePlayback(part: 'A' | 'B' | 'C') {
  playbackVisible.value[part] = !playbackVisible.value[part]
}

onMounted(async () => {
  if (examStore.currentAttempt?.id === props.attemptId) {
    attempt.value = examStore.currentAttempt
  } else {
    attempt.value = getAttemptFromCache(props.attemptId)
  }
  await persistAttempt()
})
</script>

<template>
  <section v-if="attempt" class="result-page">
    <!-- ===== 总分区 ===== -->
    <div class="score-hero">
      <div class="score-dial">
        <p class="score-number">{{ attempt.totalScore }}</p>
        <p class="score-label">分</p>
      </div>
      <span
        :class="[
          'tag',
          attempt.totalScore >= 85 ? 'tag-excellent' : attempt.totalScore >= 72 ? 'tag-good' : attempt.totalScore >= 60 ? 'tag-fair' : 'tag-needs-work'
        ]"
      >{{ levelLabel }}</span>
      <p class="score-meta">
        模式：{{ attempt.mode === 'mock' ? '模拟考试' : '专项练习' }} &middot; 用时 {{ attempt.totalDuration }} 秒
      </p>
      <router-link class="btn-primary" to="/practice">继续练习</router-link>
    </div>

    <!-- ===== Part 结果卡片 ===== -->
    <article
      v-for="part in attempt.partResults"
      :key="part.part"
      :class="['part-card', `part-card--${part.part}`]"
    >
      <div class="part-header">
        <div class="part-badge" :class="`part-badge--${part.part}`">Part {{ part.part }}</div>
        <p class="part-score">{{ part.score.overall }} <span class="part-score-unit">分</span></p>
      </div>

      <div v-if="recordingUrl(part.part)" class="playback">
        <button class="btn-secondary" @click="togglePlayback(part.part)">
          {{ playbackVisible[part.part] ? '隐藏录音回放' : '回放我的录音' }}
        </button>
        <audio
          v-if="playbackVisible[part.part]"
          controls
          :src="recordingUrl(part.part) ?? ''"
        />
      </div>

      <!-- 维度分数条 -->
      <div class="metrics">
        <div v-for="metric in partMetrics(part)" :key="metric.label" class="metric-row">
          <span class="metric-label">{{ metric.label }}</span>
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{
                width: `${metric.value}%`,
                backgroundColor: part.part === 'A' ? 'var(--color-part-a)' : part.part === 'B' ? 'var(--color-part-b)' : 'var(--color-part-c)'
              }"
            ></div>
          </div>
          <span class="metric-value">{{ metric.value }}</span>
        </div>
      </div>

      <!-- 诊断建议 -->
      <div class="diagnostic">
        <h3 class="diagnostic-title">诊断建议</h3>
        <p v-if="part.diagnosticReport.strengths.length" class="diag-line diag-line--strength">
          <span class="diag-marker diag-marker--strength"></span>
          {{ part.diagnosticReport.strengths.join('；') }}
        </p>
        <p v-if="part.diagnosticReport.weaknesses.length" class="diag-line diag-line--weakness">
          <span class="diag-marker diag-marker--weakness"></span>
          {{ part.diagnosticReport.weaknesses.join('；') }}
        </p>
        <ul v-if="part.diagnosticReport.specificErrors.length" class="error-list">
          <li v-for="(issue, index) in part.diagnosticReport.specificErrors" :key="index" class="error-item">
            <p class="error-detail">{{ issue.detail }}</p>
            <p class="error-suggestion">{{ issue.suggestion }}</p>
          </li>
        </ul>
        <div v-if="part.diagnosticReport.recommendedArticles.length" class="reco">
          <span class="reco-label">推荐学习</span>
          <router-link
            v-for="articleId in part.diagnosticReport.recommendedArticles"
            :key="articleId"
            :to="articleRoute(articleId)"
            class="reco-pill"
          >
            {{ articleId }}
          </router-link>
        </div>
      </div>
    </article>
  </section>

  <!-- ===== 空态 ===== -->
  <div v-else class="empty-state">
    <div class="empty-icon">&#9744;</div>
    <h1>未找到练习记录</h1>
    <p class="text-secondary">该记录可能已过期。请返回练习中心重新作答。</p>
    <router-link class="btn-primary" to="/practice">返回练习中心</router-link>
  </div>
</template>

<style scoped>
/* ===== 整体布局 ===== */
.result-page {
  display: grid;
  gap: var(--space-md);
}

/* ===== 总分区 ===== */
.score-hero {
  display: grid;
  justify-items: center;
  gap: var(--space-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
}

.score-dial {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
}

.score-number {
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1.1;
}

.score-label {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.score-meta {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* ===== Part 结果卡片 ===== */
.part-card {
  display: grid;
  gap: var(--space-md);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--space-lg);
}

.part-card--A {
  border-color: var(--color-part-a);
}

.part-card--B {
  border-color: var(--color-part-b);
}

.part-card--C {
  border-color: var(--color-part-c);
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.part-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 600;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.part-badge--A {
  color: var(--color-part-a);
  border-color: var(--color-part-a);
  background: #f0f9ff;
}

.part-badge--B {
  color: var(--color-part-b);
  border-color: var(--color-part-b);
  background: var(--color-surface-hover);
}

.part-badge--C {
  color: var(--color-part-c);
  border-color: var(--color-part-c);
  background: #fff7ed;
}

.part-score {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-text);
}

.part-score-unit {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* ===== 录音回放 ===== */
.playback {
  display: grid;
  gap: var(--space-sm);
}

/* ===== 维度分数条 ===== */
.metrics {
  display: grid;
  gap: 10px;
}

.metric-row {
  display: grid;
  grid-template-columns: 96px 1fr 36px;
  gap: var(--space-sm);
  align-items: center;
}

.metric-label {
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
  transition: width var(--duration-slow) var(--ease-out-expo);
}

.metric-value {
  font-size: var(--text-sm);
  font-weight: 700;
  text-align: right;
  color: var(--color-text);
}

/* ===== 诊断建议区 ===== */
.diagnostic {
  display: grid;
  gap: var(--space-sm);
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.diagnostic-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
}

.diag-line {
  font-size: var(--text-sm);
  line-height: 1.6;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
}

.diag-line--strength {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.diag-line--weakness {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.diag-marker {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.diag-marker--strength {
  background: var(--color-success);
}

.diag-marker--weakness {
  background: var(--color-error);
}

/* ===== 错误列表 ===== */
.error-list {
  list-style: none;
  display: grid;
  gap: var(--space-sm);
}

.error-item {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  display: grid;
  gap: 2px;
}

.error-detail {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.error-suggestion {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* ===== 推荐文章 ===== */
.reco {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.reco-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.reco-pill {
  font-size: var(--text-xs);
  font-weight: 500;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  padding: 2px 12px;
  color: var(--color-primary);
  background: #f0fdf4;
  transition: background var(--duration-fast) var(--ease-in-out);
  text-decoration: none;
}

.reco-pill:hover {
  background: var(--color-primary);
  color: #fff;
}

/* ===== 空态 ===== */
.empty-state {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
  text-align: center;
  padding: var(--space-3xl) var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 3rem;
  color: var(--color-text-muted);
  line-height: 1;
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .score-number {
    font-size: 2.4rem;
  }

  .metric-row {
    grid-template-columns: 80px 1fr 32px;
    gap: var(--space-xs);
  }

  .metric-label {
    font-size: var(--text-xs);
  }

  .part-card {
    padding: var(--space-md);
  }

  .empty-state {
    padding: var(--space-2xl) var(--space-md);
  }
}
</style>
