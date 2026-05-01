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
    <article class="card summary">
      <h1>练习结果</h1>
      <p class="score">{{ attempt.totalScore }} 分</p>
      <p class="text-secondary">等级：{{ levelLabel }} · 用时 {{ attempt.totalDuration }} 秒</p>
      <router-link class="btn-secondary" to="/practice">继续练习</router-link>
    </article>

    <article
      v-for="part in attempt.partResults"
      :key="part.part"
      class="card part-card"
    >
      <div class="part-head">
        <h2>Part {{ part.part }}</h2>
        <p class="part-score">{{ part.score.overall }} 分</p>
      </div>

      <div class="metrics">
        <div v-for="metric in partMetrics(part)" :key="metric.label" class="metric-row">
          <span>{{ metric.label }}</span>
          <div class="bar-wrap">
            <div class="bar-fill" :style="{ width: `${metric.value}%` }"></div>
          </div>
          <strong>{{ metric.value }}</strong>
        </div>
      </div>

      <div class="diagnostic">
        <h3>诊断建议</h3>
        <p v-if="part.diagnosticReport.strengths.length">
          ✅ {{ part.diagnosticReport.strengths.join('；') }}
        </p>
        <p v-if="part.diagnosticReport.weaknesses.length">
          ⚠️ {{ part.diagnosticReport.weaknesses.join('；') }}
        </p>
        <ul v-if="part.diagnosticReport.specificErrors.length" class="error-list">
          <li v-for="(issue, index) in part.diagnosticReport.specificErrors" :key="index">
            <p><strong>{{ issue.detail }}</strong></p>
            <p class="text-secondary">{{ issue.suggestion }}</p>
          </li>
        </ul>
        <div v-if="part.diagnosticReport.recommendedArticles.length" class="reco">
          <p>推荐学习：</p>
          <router-link
            v-for="articleId in part.diagnosticReport.recommendedArticles"
            :key="articleId"
            :to="articleRoute(articleId)"
            class="reco-link"
          >
            {{ articleId }}
          </router-link>
        </div>
      </div>
    </article>
  </section>

  <article v-else class="card">
    <h1>未找到练习记录</h1>
    <p class="text-secondary">该记录可能已过期。请返回练习中心重新作答。</p>
    <router-link class="btn-primary" to="/practice">返回练习中心</router-link>
  </article>
</template>

<style scoped>
.result-page {
  display: grid;
  gap: 12px;
}

.summary {
  display: grid;
  gap: 8px;
}

.score {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--color-primary-dark);
}

.part-card {
  display: grid;
  gap: 12px;
}

.part-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.part-score {
  font-size: 1.4rem;
  font-weight: 800;
}

.metrics {
  display: grid;
  gap: 8px;
}

.metric-row {
  display: grid;
  grid-template-columns: 96px 1fr 40px;
  gap: 8px;
  align-items: center;
}

.bar-wrap {
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #2563eb);
}

.diagnostic {
  display: grid;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
}

.error-list {
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.reco {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.reco-link {
  font-size: 0.88rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  background: #fff;
}
</style>
