<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockExams } from '@/data/examContent'
import { scorePartA, scorePartB, scorePartC } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { useTimer } from '@/composables/useTimer'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const timerA = useTimer()
const timerB = useTimer()
const timerC = useTimer()

const selectedMockId = ref(
  typeof route.query.paper === 'string' ? route.query.paper : mockExams[0].id
)
const partATranscript = ref('')
const partCTranscript = ref('')
const askResponses = ref<string[]>(['', '', ''])
const answerResponses = ref<string[]>(['', '', '', '', ''])
const voiceListeningKey = ref<string | null>(null)
const voiceError = ref('')

type SpeechCtor = new () => any
let recognition: any = null
const speechSupported =
  typeof window !== 'undefined' &&
  Boolean(
    (window as Window & { SpeechRecognition?: SpeechCtor }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: SpeechCtor }).webkitSpeechRecognition
  )

const selectedMock = computed(
  () => mockExams.find((item) => item.id === selectedMockId.value) ?? mockExams[0]
)
const partADuration = computed(() => timerA.elapsedSeconds.value)
const partBDuration = computed(() => timerB.elapsedSeconds.value)
const partCDuration = computed(() => timerC.elapsedSeconds.value)
const partARunning = computed(() => timerA.isRunning.value)
const partBRunning = computed(() => timerB.isRunning.value)
const partCRunning = computed(() => timerC.isRunning.value)
const totalDuration = computed(
  () => partADuration.value + partBDuration.value + partCDuration.value
)

watch(selectedMockId, () => {
  partATranscript.value = ''
  partCTranscript.value = ''
  askResponses.value = ['', '', '']
  answerResponses.value = ['', '', '', '', '']
  timerA.reset()
  timerB.reset()
  timerC.reset()
  voiceError.value = ''
  stopRecognition()
})

function stopRecognition() {
  if (recognition) {
    try {
      recognition.stop()
    } catch {
      // Ignore stop errors
    }
    recognition = null
  }
  voiceListeningKey.value = null
}

function startVoiceInput(target: 'partA' | 'partC') {
  voiceError.value = ''
  if (!speechSupported) {
    voiceError.value = '当前浏览器不支持语音识别，请手动输入。'
    return
  }
  stopRecognition()

  const customWindow = window as Window & {
    SpeechRecognition?: SpeechCtor
    webkitSpeechRecognition?: SpeechCtor
  }
  const Ctor = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition
  if (!Ctor) {
    voiceError.value = '当前浏览器不支持语音识别，请手动输入。'
    return
  }

  const key = `mock-${target}`
  const instance = new Ctor()
  instance.lang = 'en-US'
  instance.continuous = false
  instance.interimResults = false
  instance.maxAlternatives = 1
  instance.onstart = () => {
    voiceListeningKey.value = key
  }
  instance.onresult = (event: any) => {
    const text = Array.from(event.results || [])
      .map((result: any) => result[0]?.transcript ?? '')
      .join(' ')
      .trim()
    if (!text) return
    if (target === 'partA') {
      partATranscript.value = text
    } else {
      partCTranscript.value = text
    }
  }
  instance.onerror = () => {
    voiceError.value = '语音识别失败，请改为手动输入。'
    voiceListeningKey.value = null
    recognition = null
  }
  instance.onend = () => {
    voiceListeningKey.value = null
    recognition = null
  }
  recognition = instance
  instance.start()
}

function toggleTimer(part: 'A' | 'B' | 'C') {
  const timer = part === 'A' ? timerA : part === 'B' ? timerB : timerC
  if (timer.isRunning.value) {
    timer.stop()
  } else {
    timer.start()
  }
}

function submitMock() {
  const confirmed = window.confirm('你确定要提交吗？提交后将生成完整诊断报告。')
  if (!confirmed) {
    return
  }
  stopRecognition()
  timerA.stop()
  timerB.stop()
  timerC.stop()

  const mock = selectedMock.value
  const durationA = Math.max(partADuration.value, 30)
  const durationB = Math.max(partBDuration.value, 60)
  const durationC = Math.max(partCDuration.value, 45)

  const resultA = scorePartA({
    passage: mock.partA,
    transcript: partATranscript.value,
    durationSeconds: durationA,
  })
  const resultB = scorePartB({
    scenario: mock.partB,
    askResponses: askResponses.value,
    answerResponses: answerResponses.value,
    durationSeconds: durationB,
  })
  const resultC = scorePartC({
    story: mock.partC,
    transcript: partCTranscript.value,
    durationSeconds: durationC,
  })

  const totalScore = Math.round(
    (resultA.score.overall + resultB.score.overall + resultC.score.overall) / 3
  )
  const attempt: ExamAttempt = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mode: 'mock',
    partResults: [resultA, resultB, resultC],
    totalScore,
    totalDuration: totalDuration.value,
    partDurations: {
      A: durationA,
      B: durationB,
      C: durationC,
    },
  }

  examStore.currentAttempt = attempt
  examStore.partResults = [resultA, resultB, resultC]
  saveAttemptToCache(attempt)
  router.push({ name: 'result', params: { attemptId: attempt.id } })
}

onBeforeUnmount(() => {
  timerA.stop()
  timerB.stop()
  timerC.stop()
  stopRecognition()
})
</script>

<template>
  <!-- ===== 头部 + 试卷选择 + 计时 ===== -->
  <div class="exam-head">
    <h1>模拟考试</h1>
    <p class="text-secondary">一次完成 Part A / B / C，获取综合诊断报告</p>
    <div class="exam-controls">
      <div class="paper-select">
        <label for="paper">试卷</label>
        <select id="paper" v-model="selectedMockId">
          <option v-for="paper in mockExams" :key="paper.id" :value="paper.id">
            {{ paper.title }}
          </option>
        </select>
      </div>
      <p class="exam-timer">总用时：<strong>{{ totalDuration }}</strong> 秒</p>
    </div>
    <p v-if="voiceError" class="warn">{{ voiceError }}</p>
  </div>

  <!-- ===== Part A ===== -->
  <section class="exam-block">
    <div class="block-head">
      <span class="part-badge part-badge--A">Part A</span>
      <h2>{{ selectedMock.partA.title }}</h2>
    </div>
    <div class="content-box">
      <p>{{ selectedMock.partA.passage }}</p>
    </div>
    <div class="block-actions">
      <button class="btn-secondary" @click="toggleTimer('A')">
        {{ partARunning ? '暂停计时' : '开始计时' }}
      </button>
      <button class="btn-secondary" @click="startVoiceInput('partA')">
        {{ voiceListeningKey === 'mock-partA' ? '识别中...' : '语音输入' }}
      </button>
      <span class="part-timer">Part A 用时 {{ partADuration }} 秒</span>
    </div>
    <textarea v-model="partATranscript" rows="6" placeholder="输入 Part A 朗读文本..." />
  </section>

  <hr class="divider" />

  <!-- ===== Part B ===== -->
  <section class="exam-block">
    <div class="block-head">
      <span class="part-badge part-badge--B">Part B</span>
      <h2>{{ selectedMock.partB.scenario }}</h2>
    </div>
    <div class="block-actions">
      <button class="btn-secondary" @click="toggleTimer('B')">
        {{ partBRunning ? '暂停计时' : '开始计时' }}
      </button>
      <span class="part-timer">Part B 用时 {{ partBDuration }} 秒</span>
    </div>

    <h3 class="sub-head">提问（3 题）</h3>
    <div v-for="(q, idx) in selectedMock.partB.questionsToAsk" :key="q.id" class="qa-item">
      <p class="qa-prompt">{{ idx + 1 }}. {{ q.chinesePrompt }}</p>
      <textarea v-model="askResponses[idx]" rows="2" placeholder="输入你的提问..." />
    </div>

    <h3 class="sub-head">回答（5 题）</h3>
    <div v-for="(q, idx) in selectedMock.partB.questionsToAnswer" :key="q.id" class="qa-item">
      <p class="qa-prompt">{{ idx + 1 }}. {{ q.englishQuestion }}</p>
      <textarea v-model="answerResponses[idx]" rows="2" placeholder="输入你的回答..." />
    </div>
  </section>

  <hr class="divider" />

  <!-- ===== Part C ===== -->
  <section class="exam-block">
    <div class="block-head">
      <span class="part-badge part-badge--C">Part C</span>
      <h2>{{ selectedMock.partC.title }}</h2>
    </div>
    <div class="content-box">
      <p>{{ selectedMock.partC.storyText }}</p>
    </div>
    <div class="block-actions">
      <button class="btn-secondary" @click="toggleTimer('C')">
        {{ partCRunning ? '暂停计时' : '开始计时' }}
      </button>
      <button class="btn-secondary" @click="startVoiceInput('partC')">
        {{ voiceListeningKey === 'mock-partC' ? '识别中...' : '语音输入' }}
      </button>
      <span class="part-timer">Part C 用时 {{ partCDuration }} 秒</span>
    </div>
    <textarea v-model="partCTranscript" rows="8" placeholder="输入你的故事复述..." />
    <button class="btn-primary btn-large" @click="submitMock">提交整卷并生成报告</button>
  </section>
</template>

<style scoped>
/* ===== 头部区域 ===== */
.exam-head {
  display: grid;
  gap: var(--space-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.exam-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
}

.paper-select {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.paper-select label {
  font-weight: 600;
  font-size: var(--text-sm);
  white-space: nowrap;
}

select {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: var(--text-sm);
  font-family: inherit;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  min-width: 200px;
}

select:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.exam-timer {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.exam-timer strong {
  color: var(--color-text);
  font-size: var(--text-base);
}

.warn {
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
}

/* ===== Part 区块 ===== */
.exam-block {
  display: grid;
  gap: var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.block-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.block-head h2 {
  font-size: var(--text-xl);
}

.sub-head {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
}

/* ===== Part 徽章 ===== */
.part-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.02em;
  border: 1px solid;
  flex-shrink: 0;
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

/* ===== 内容展示区（Part A / C） ===== */
.content-box {
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  max-height: 140px;
  overflow: auto;
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--color-text-secondary);
}

/* ===== 操作按钮行 ===== */
.block-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.part-timer {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-left: auto;
}

/* ===== Part B Q&A 项 ===== */
.qa-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px;
  display: grid;
  gap: var(--space-sm);
}

.qa-prompt {
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.5;
}

/* ===== 文本域 ===== */
textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-md);
  resize: vertical;
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: 1.6;
  background: var(--color-surface);
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .exam-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  select {
    width: 100%;
    min-width: unset;
  }

  .block-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .part-timer {
    margin-left: 0;
  }

  .exam-block {
    padding: var(--space-md);
  }

  .block-head {
    flex-wrap: wrap;
  }
}
</style>
