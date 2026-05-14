<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { partBScenarios } from '@/data/examContent'
import { scorePartB } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { useTimer } from '@/composables/useTimer'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const questionTimer = useTimer()
const totalTimer = useTimer()

const askResponses = ref<string[]>(['', '', ''])
const answerResponses = ref<string[]>(['', '', '', '', ''])
const stage = ref<'ask' | 'answer' | 'done'>('ask')
const activeAskIndex = ref(0)
const activeAnswerIndex = ref(0)
const flowStarted = ref(false)
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

const selectedScenario = computed(() =>
  partBScenarios.find((item) => item.id === route.params.id)
)
const running = computed(() => questionTimer.isRunning.value)
const totalDurationSeconds = computed(() => totalTimer.elapsedSeconds.value)
const currentCountdown = computed(() => questionTimer.remainingSeconds.value)
const countdownUrgent = computed(
  () => currentCountdown.value > 0 && currentCountdown.value <= 5
)

watch(selectedScenario, () => {
  askResponses.value = ['', '', '']
  answerResponses.value = ['', '', '', '', '']
  stage.value = 'ask'
  activeAskIndex.value = 0
  activeAnswerIndex.value = 0
  flowStarted.value = false
  voiceError.value = ''
  questionTimer.reset()
  totalTimer.reset()
  stopRecognition()
})

watch(
  () => questionTimer.remainingSeconds.value,
  (remaining) => {
    if (flowStarted.value && stage.value !== 'done' && remaining === 0) {
      moveToNextQuestionByTimeout()
    }
  }
)

function chooseScenario(id: string) {
  router.push(`/practice/part-b/${id}`)
}

function startQuestionTimer(limit: number) {
  questionTimer.reset()
  questionTimer.setDuration(limit)
  questionTimer.start()
}

function startFlow() {
  if (flowStarted.value || !selectedScenario.value) {
    return
  }
  flowStarted.value = true
  stage.value = 'ask'
  activeAskIndex.value = 0
  activeAnswerIndex.value = 0
  startQuestionTimer(20)
  totalTimer.reset()
  totalTimer.start()
}

function pauseFlow() {
  questionTimer.stop()
  totalTimer.stop()
}

function resumeFlow() {
  if (!flowStarted.value || stage.value === 'done') {
    return
  }
  questionTimer.start()
  totalTimer.start()
}

function moveToNextQuestionByTimeout() {
  if (stage.value === 'ask') {
    if (activeAskIndex.value < 2) {
      activeAskIndex.value += 1
      startQuestionTimer(20)
      return
    }
    stage.value = 'answer'
    activeAnswerIndex.value = 0
    startQuestionTimer(30)
    return
  }

  if (stage.value === 'answer') {
    if (activeAnswerIndex.value < 4) {
      activeAnswerIndex.value += 1
      startQuestionTimer(30)
      return
    }
    stage.value = 'done'
    pauseFlow()
  }
}

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

function setVoiceResult(section: 'ask' | 'answer', index: number, text: string) {
  if (section === 'ask') {
    askResponses.value[index] = text
  } else {
    answerResponses.value[index] = text
  }
}

function startVoiceInput(section: 'ask' | 'answer', index: number) {
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

  const key = `${section}-${index}`
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
    if (text) {
      setVoiceResult(section, index, text)
    }
  }
  instance.onerror = () => {
    voiceError.value = '语音识别失败，请改为手动输入。'
    voiceListeningKey.value = null
    recognition = null
  }
  instance.onend = () => {
    if (voiceListeningKey.value === key) {
      voiceListeningKey.value = null
    }
    recognition = null
  }

  recognition = instance
  instance.start()
}

function submit() {
  if (!selectedScenario.value) {
    return
  }
  pauseFlow()
  stopRecognition()
  const result = scorePartB({
    scenario: selectedScenario.value,
    askResponses: askResponses.value,
    answerResponses: answerResponses.value,
    durationSeconds: Math.max(totalDurationSeconds.value, 40),
  })

  const attempt: ExamAttempt = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mode: 'practice',
    partResults: [result],
    totalScore: result.score.overall,
    totalDuration: result.duration,
    partDurations: { B: result.duration },
  }

  examStore.currentAttempt = attempt
  examStore.partResults = [result]
  saveAttemptToCache(attempt)
  router.push({ name: 'result', params: { attemptId: attempt.id } })
}

onBeforeUnmount(() => {
  questionTimer.stop()
  totalTimer.stop()
  stopRecognition()
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
      <p class="text-secondary">总用时：{{ totalDurationSeconds }} 秒</p>
      <div class="actions">
        <button class="btn-primary" @click="startFlow" :disabled="flowStarted">开始练习</button>
        <button class="btn-secondary" @click="pauseFlow" :disabled="!running">暂停计时</button>
        <button class="btn-secondary" @click="resumeFlow" :disabled="running || !flowStarted">
          继续
        </button>
      </div>
      <p class="countdown" :class="{ urgent: countdownUrgent }">
        当前题剩余：{{ currentCountdown }} 秒
      </p>
      <p class="text-secondary">
        当前阶段：{{
          stage === 'ask'
            ? '提问环节（20 秒/题）'
            : stage === 'answer'
              ? '回答环节（30 秒/题）'
              : '已完成答题'
        }}
      </p>
      <p v-if="voiceError" class="warn">{{ voiceError }}</p>
    </article>

    <article class="card qa">
      <h3>提问环节（3 题）</h3>
      <div
        v-for="(question, index) in selectedScenario.questionsToAsk"
        :key="question.id"
        class="qa-item"
        :class="{ active: stage === 'ask' && flowStarted && index === activeAskIndex }"
      >
        <p class="status">{{ askResponses[index].trim() ? '✅' : '○' }}</p>
        <p><strong>提示 {{ index + 1 }}：</strong>{{ question.chinesePrompt }}</p>
        <p class="hint">参考：{{ question.englishReference }}</p>
        <button class="btn-secondary btn-voice" @click="startVoiceInput('ask', index)">
          {{ voiceListeningKey === `ask-${index}` ? '🎤 识别中...' : '🎤 语音输入' }}
        </button>
        <textarea v-model="askResponses[index]" rows="3" placeholder="请用英文提问..." />
      </div>
    </article>

    <article class="card qa">
      <h3>回答环节（5 题）</h3>
      <div
        v-for="(question, index) in selectedScenario.questionsToAnswer"
        :key="question.id"
        class="qa-item"
        :class="{ active: stage === 'answer' && flowStarted && index === activeAnswerIndex }"
      >
        <p class="status">{{ answerResponses[index].trim() ? '✅' : '○' }}</p>
        <p><strong>问题 {{ index + 1 }}：</strong>{{ question.englishQuestion }}</p>
        <p class="hint">参考：{{ question.referenceAnswer }}</p>
        <button class="btn-secondary btn-voice" @click="startVoiceInput('answer', index)">
          {{ voiceListeningKey === `answer-${index}` ? '🎤 识别中...' : '🎤 语音输入' }}
        </button>
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

.countdown {
  margin-top: 8px;
  font-weight: 700;
}

.countdown.urgent {
  color: #b91c1c;
}

.warn {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  border-radius: var(--radius-sm);
  padding: 8px 10px;
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
  position: relative;
}

.qa-item.active {
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 1px rgba(20, 184, 166, 0.25);
}

.status {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 0.9rem;
}

.qa-item > p:not(.status) {
  margin-left: 18px;
}

.hint {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.btn-voice {
  justify-self: start;
  padding: 6px 10px;
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
