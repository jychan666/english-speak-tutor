<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockExams } from '@/data/examContent'
import { scorePartA, scorePartB, scorePartC } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

const selectedMockId = ref(
  typeof route.query.paper === 'string' ? route.query.paper : mockExams[0].id
)
const partATranscript = ref('')
const partCTranscript = ref('')
const askResponses = ref<string[]>(['', '', ''])
const answerResponses = ref<string[]>(['', '', '', '', ''])
const durationSeconds = ref(0)
const running = ref(false)
let timer: number | null = null

const selectedMock = computed(() =>
  mockExams.find((item) => item.id === selectedMockId.value) ?? mockExams[0]
)

watch(selectedMockId, () => {
  partATranscript.value = ''
  partCTranscript.value = ''
  askResponses.value = ['', '', '']
  answerResponses.value = ['', '', '', '', '']
  durationSeconds.value = 0
  stopTimer()
})

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

function submitMock() {
  const mock = selectedMock.value
  const totalDuration = Math.max(durationSeconds.value, 90)
  const singleDuration = Math.round(totalDuration / 3)

  const resultA = scorePartA({
    passage: mock.partA,
    transcript: partATranscript.value,
    durationSeconds: singleDuration,
  })
  const resultB = scorePartB({
    scenario: mock.partB,
    askResponses: askResponses.value,
    answerResponses: answerResponses.value,
    durationSeconds: singleDuration,
  })
  const resultC = scorePartC({
    story: mock.partC,
    transcript: partCTranscript.value,
    durationSeconds: singleDuration,
  })

  const totalScore = Math.round((resultA.score.overall + resultB.score.overall + resultC.score.overall) / 3)
  const attempt: ExamAttempt = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mode: 'mock',
    partResults: [resultA, resultB, resultC],
    totalScore,
    totalDuration,
  }

  examStore.currentAttempt = attempt
  examStore.partResults = [resultA, resultB, resultC]
  saveAttemptToCache(attempt)
  router.push({ name: 'result', params: { attemptId: attempt.id } })
}
</script>

<template>
  <section class="card head">
    <h1>模拟考试</h1>
    <p class="text-secondary">一次完成 Part A / B / C，获取综合诊断。</p>
  </section>

  <section class="card">
    <label for="paper">选择模拟卷</label>
    <select id="paper" v-model="selectedMockId">
      <option v-for="paper in mockExams" :key="paper.id" :value="paper.id">
        {{ paper.title }}
      </option>
    </select>
    <div class="actions">
      <button class="btn-primary" @click="startTimer" :disabled="running">开始整卷计时</button>
      <button class="btn-secondary" @click="stopTimer" :disabled="!running">暂停</button>
      <p class="timer">已用时 {{ durationSeconds }} 秒</p>
    </div>
  </section>

  <section class="card block">
    <h2>Part A - {{ selectedMock.partA.title }}</h2>
    <p class="hint">{{ selectedMock.partA.passage }}</p>
    <textarea v-model="partATranscript" rows="6" placeholder="输入 Part A 朗读文本..." />
  </section>

  <section class="card block">
    <h2>Part B - {{ selectedMock.partB.scenario }}</h2>
    <h3>提问（3 题）</h3>
    <div v-for="(q, idx) in selectedMock.partB.questionsToAsk" :key="q.id" class="qa-item">
      <p>{{ idx + 1 }}. {{ q.chinesePrompt }}</p>
      <textarea v-model="askResponses[idx]" rows="2" placeholder="输入你的提问..." />
    </div>
    <h3>回答（5 题）</h3>
    <div v-for="(q, idx) in selectedMock.partB.questionsToAnswer" :key="q.id" class="qa-item">
      <p>{{ idx + 1 }}. {{ q.englishQuestion }}</p>
      <textarea v-model="answerResponses[idx]" rows="2" placeholder="输入你的回答..." />
    </div>
  </section>

  <section class="card block">
    <h2>Part C - {{ selectedMock.partC.title }}</h2>
    <p class="hint">{{ selectedMock.partC.storyText }}</p>
    <textarea v-model="partCTranscript" rows="8" placeholder="输入你的故事复述..." />
    <button class="btn-primary" @click="submitMock">提交整卷并生成报告</button>
  </section>
</template>

<style scoped>
.head {
  display: grid;
  gap: 8px;
}

label {
  font-weight: 700;
}

select {
  margin-top: 8px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px 10px;
}

.actions {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.timer {
  font-weight: 700;
}

.block {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.hint {
  color: var(--color-text-secondary);
  max-height: 110px;
  overflow: auto;
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px;
}

.qa-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px;
  display: grid;
  gap: 6px;
}

textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px;
  resize: vertical;
  font-family: inherit;
}
</style>
