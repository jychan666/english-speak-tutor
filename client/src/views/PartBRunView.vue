<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { partBScenarios } from '@/data/examContent'
import { scorePartB } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

const askResponses = ref<string[]>(['', '', ''])
const answerResponses = ref<string[]>(['', '', '', '', ''])
const durationSeconds = ref(0)
const running = ref(false)
let timer: number | null = null

const selectedScenario = computed(() =>
  partBScenarios.find((item) => item.id === route.params.id)
)

watch(selectedScenario, () => {
  askResponses.value = ['', '', '']
  answerResponses.value = ['', '', '', '', '']
  durationSeconds.value = 0
  stopTimer()
})

function chooseScenario(id: string) {
  router.push(`/practice/part-b/${id}`)
}

function startTimer() {
  if (running.value) return
  running.value = true
  timer = window.setInterval(() => {
    durationSeconds.value += 1
  }, 1000)
}

function stopTimer() {
  running.value = false
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
}

function submit() {
  if (!selectedScenario.value) {
    return
  }
  stopTimer()
  const result = scorePartB({
    scenario: selectedScenario.value,
    askResponses: askResponses.value,
    answerResponses: answerResponses.value,
    durationSeconds: Math.max(durationSeconds.value, 40),
  })

  const attempt: ExamAttempt = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mode: 'practice',
    partResults: [result],
    totalScore: result.score.overall,
    totalDuration: result.duration,
  }

  examStore.currentAttempt = attempt
  examStore.partResults = [result]
  saveAttemptToCache(attempt)
  router.push({ name: 'result', params: { attemptId: attempt.id } })
}

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<template>
  <section class="card head">
    <h1>Part B - 角色扮演</h1>
    <p class="text-secondary">先提 3 个问题，再回答 5 个问题。重点看语法和相关性。</p>
  </section>

  <section v-if="!selectedScenario" class="grid">
    <article v-for="item in partBScenarios" :key="item.id" class="card scenario-card">
      <h2>{{ item.role }}</h2>
      <p class="text-secondary">{{ item.scenario }}</p>
      <button class="btn-primary" @click="chooseScenario(item.id)">选择场景</button>
    </article>
  </section>

  <section v-else class="run-area">
    <article class="card">
      <h2>场景描述</h2>
      <p>{{ selectedScenario.scenario }}</p>
      <p class="text-secondary">计时：{{ durationSeconds }} 秒</p>
      <div class="actions">
        <button class="btn-primary" @click="startTimer" :disabled="running">开始计时</button>
        <button class="btn-secondary" @click="stopTimer" :disabled="!running">暂停计时</button>
      </div>
    </article>

    <article class="card qa">
      <h3>提问环节（3 题）</h3>
      <div v-for="(question, index) in selectedScenario.questionsToAsk" :key="question.id" class="qa-item">
        <p><strong>提示 {{ index + 1 }}：</strong>{{ question.chinesePrompt }}</p>
        <p class="hint">参考：{{ question.englishReference }}</p>
        <textarea v-model="askResponses[index]" rows="3" placeholder="请用英文提问..." />
      </div>
    </article>

    <article class="card qa">
      <h3>回答环节（5 题）</h3>
      <div v-for="(question, index) in selectedScenario.questionsToAnswer" :key="question.id" class="qa-item">
        <p><strong>问题 {{ index + 1 }}：</strong>{{ question.englishQuestion }}</p>
        <p class="hint">参考：{{ question.referenceAnswer }}</p>
        <textarea v-model="answerResponses[index]" rows="3" placeholder="请用英文回答..." />
      </div>
      <button class="btn-primary" @click="submit">提交并生成诊断</button>
    </article>
  </section>
</template>

<style scoped>
.head {
  display: grid;
  gap: 8px;
}

.grid {
  margin-top: 16px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.scenario-card {
  display: grid;
  gap: 10px;
}

.run-area {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.qa {
  display: grid;
  gap: 10px;
}

.qa-item {
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px;
  display: grid;
  gap: 8px;
}

.hint {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

textarea {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px;
  resize: vertical;
  font-family: inherit;
}
</style>
