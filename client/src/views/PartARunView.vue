<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { partAPassages } from '@/data/examContent'
import { scorePartA } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const speech = useSpeechRecognition()

const manualTranscript = ref('')
const durationSeconds = ref(0)
const running = ref(false)
let timer: number | null = null

const selectedPassage = computed(() =>
  partAPassages.find((item) => item.id === route.params.id)
)

function choosePassage(id: string) {
  router.push(`/practice/part-a/${id}`)
}

function playDemo() {
  if (!selectedPassage.value || !window.speechSynthesis) {
    return
  }
  const utterance = new SpeechSynthesisUtterance(selectedPassage.value.passage)
  utterance.lang = 'en-US'
  utterance.rate = 0.92
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
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

function startPractice() {
  durationSeconds.value = 0
  manualTranscript.value = ''
  speech.start()
  startTimer()
}

function stopPractice() {
  speech.stop()
  stopTimer()
}

function submit() {
  if (!selectedPassage.value) {
    return
  }
  stopPractice()
  const transcript = [speech.transcript.value, manualTranscript.value].join(' ').trim()
  if (!transcript) {
    return
  }
  const result = scorePartA({
    passage: selectedPassage.value,
    transcript,
    durationSeconds: Math.max(durationSeconds.value, 30),
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
  stopPractice()
})
</script>

<template>
  <section class="card head">
    <h1>Part A - 模仿朗读</h1>
    <p class="text-secondary">步骤：听示范 → 准备 1 分钟 → 开口朗读 → 查看诊断。</p>
  </section>

  <section v-if="!selectedPassage" class="grid">
    <article v-for="item in partAPassages" :key="item.id" class="card passage-card">
      <h2>{{ item.title }}</h2>
      <p class="text-secondary">{{ item.topic }} · 难度 {{ item.difficulty }}</p>
      <p class="text-secondary">约 {{ item.wordCount }} 词</p>
      <button class="btn-primary" @click="choosePassage(item.id)">选择这篇</button>
    </article>
  </section>

  <section v-else class="run-area">
    <article class="card passage">
      <h2>{{ selectedPassage.title }}</h2>
      <p class="text-secondary">建议先听示范，再开始录入。</p>
      <p class="passage-text">{{ selectedPassage.passage }}</p>
      <div class="actions">
        <button class="btn-secondary" @click="playDemo">播放示范朗读</button>
        <button class="btn-primary" @click="startPractice" :disabled="running">开始朗读</button>
        <button class="btn-secondary" @click="stopPractice" :disabled="!running">停止</button>
      </div>
      <p class="timer">练习时长：{{ durationSeconds }} 秒</p>
      <p v-if="!speech.supported" class="warn">
        浏览器语音识别不可用，可直接在下方手动输入朗读内容后提交评分。
      </p>
    </article>

    <article class="card transcript">
      <h3>实时转写</h3>
      <p class="preview">{{ speech.transcript || '（等待语音输入）' }}</p>
      <p class="preview interim" v-if="speech.interimTranscript">{{ speech.interimTranscript }}</p>
      <textarea
        v-model="manualTranscript"
        rows="7"
        placeholder="可手动补充或直接输入你的朗读文本..."
      />
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.passage-card {
  display: grid;
  gap: 8px;
}

.run-area {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.passage {
  display: grid;
  gap: 12px;
}

.passage-text {
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  line-height: 1.8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.timer {
  font-weight: 700;
}

.warn {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}

.transcript {
  display: grid;
  gap: 10px;
}

.preview {
  background: #f8fafc;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  padding: 10px;
}

.interim {
  color: var(--color-text-secondary);
}

textarea {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px;
  resize: vertical;
  font-family: inherit;
}
</style>
