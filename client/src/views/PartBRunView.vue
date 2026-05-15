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
  <!-- ======== 页面头部 ======== -->
  <section class="card partb-head">
    <h1>Part B - 角色扮演</h1>
    <p class="text-secondary">先提 3 个问题，再回答 5 个问题。重点看语法和相关性。</p>
  </section>

  <!-- ======== 场景选择态 ======== -->
  <section v-if="!selectedScenario" class="scenario-grid">
    <article
      v-for="item in partBScenarios"
      :key="item.id"
      class="scenario-card"
    >
      <span class="scenario-badge">Part B</span>
      <h2 class="scenario-role">{{ item.role }}</h2>
      <p class="scenario-desc">{{ item.scenario }}</p>
      <button class="btn-primary" @click="chooseScenario(item.id)">选择场景</button>
    </article>
  </section>

  <!-- ======== 练习态 ======== -->
  <section v-else class="run-area">
    <!-- 场景描述头 -->
    <article class="scenario-header-card">
      <div class="scenario-color-bar"></div>
      <div class="scenario-header-body">
        <div class="scenario-header-top">
          <div class="scenario-header-info">
            <span class="scenario-role-emoji">🎭 {{ selectedScenario.role }}</span>
            <p class="scenario-text">{{ selectedScenario.scenario }}</p>
          </div>
          <div class="scenario-timer" :class="{ 'timer-urgent': countdownUrgent }">
            <span class="timer-label">当前题剩余</span>
            <span class="timer-value">{{ currentCountdown }}</span>
            <span class="timer-unit">秒</span>
          </div>
        </div>
        <div class="scenario-meta">
          <span class="meta-item">总用时：{{ totalDurationSeconds }} 秒</span>
          <span class="meta-item">
            当前阶段：{{
              stage === 'ask'
                ? '提问环节（20 秒/题）'
                : stage === 'answer'
                  ? '回答环节（30 秒/题）'
                  : '已完成答题'
            }}
          </span>
        </div>
        <div class="scenario-actions">
          <button class="btn-primary" @click="startFlow" :disabled="flowStarted">开始练习</button>
          <button class="btn-secondary" @click="pauseFlow" :disabled="!running">暂停计时</button>
          <button class="btn-secondary" @click="resumeFlow" :disabled="running || !flowStarted">继续</button>
        </div>
        <p v-if="voiceError" class="voice-warn">{{ voiceError }}</p>
      </div>
    </article>

    <!-- 对话原文 -->
    <article class="card dialogue-card">
      <h2 class="dialogue-title">📞 听对话（仅播放 1 遍）</h2>
      <p class="text-secondary dialogue-hint">先仔细听这段对话，然后根据场景进行三问五答。</p>
      <div class="dialogue-text">{{ selectedScenario.dialogue }}</div>
    </article>

    <!-- 提问环节 -->
    <article class="qa-section">
      <h2 class="qa-section-title">📝 提问环节（3 题）</h2>
      <div class="qa-cards">
        <div
          v-for="(question, index) in selectedScenario.questionsToAsk"
          :key="question.id"
          class="qa-card"
          :class="{ 'qa-active': stage === 'ask' && flowStarted && index === activeAskIndex }"
        >
          <div class="qa-card-header">
            <span class="qa-num" :class="{ 'qa-num-done': askResponses[index].trim() }">
              {{ askResponses[index].trim() ? '✅' : index + 1 }}
            </span>
            <p class="qa-prompt"><strong>提示 {{ index + 1 }}：</strong>{{ question.chinesePrompt }}</p>
          </div>
          <details class="qa-ref">
            <summary class="qa-ref-btn">📖 查看参考</summary>
            <p class="qa-ref-content">{{ question.englishReference }}</p>
          </details>
          <textarea
            v-model="askResponses[index]"
            rows="3"
            placeholder="请用英文提问..."
          ></textarea>
          <button
            class="btn-secondary btn-voice"
            @click="startVoiceInput('ask', index)"
          >
            {{ voiceListeningKey === `ask-${index}` ? '🎤 识别中...' : '🎤 语音输入' }}
          </button>
        </div>
      </div>
    </article>

    <!-- 环节分隔 -->
    <div class="stage-divider">
      <hr class="divider" />
      <span class="stage-label">回答环节</span>
    </div>

    <!-- 回答环节 -->
    <article class="qa-section">
      <h2 class="qa-section-title">🗣 回答环节（5 题）</h2>
      <div class="qa-cards">
        <div
          v-for="(question, index) in selectedScenario.questionsToAnswer"
          :key="question.id"
          class="qa-card"
          :class="{ 'qa-active': stage === 'answer' && flowStarted && index === activeAnswerIndex }"
        >
          <div class="qa-card-header">
            <span class="qa-num" :class="{ 'qa-num-done': answerResponses[index].trim() }">
              {{ answerResponses[index].trim() ? '✅' : index + 1 }}
            </span>
            <p class="qa-prompt"><strong>问题 {{ index + 1 }}：</strong>{{ question.englishQuestion }}</p>
          </div>
          <details class="qa-ref">
            <summary class="qa-ref-btn">📖 查看参考</summary>
            <p class="qa-ref-content">{{ question.referenceAnswer }}</p>
          </details>
          <textarea
            v-model="answerResponses[index]"
            rows="3"
            placeholder="请用英文回答..."
          ></textarea>
          <button
            class="btn-secondary btn-voice"
            @click="startVoiceInput('answer', index)"
          >
            {{ voiceListeningKey === `answer-${index}` ? '🎤 识别中...' : '🎤 语音输入' }}
          </button>
        </div>
      </div>
      <button class="btn-primary btn-submit" @click="submit">提交并生成诊断</button>
    </article>
  </section>
</template>

<style scoped>
/* ======== 页面头部 ======== */
.partb-head {
  display: grid;
  gap: var(--space-sm);
}

/* ======== 场景选择网格 ======== */
.scenario-grid {
  margin-top: var(--space-md);
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.scenario-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
}
.scenario-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.scenario-badge {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  background: #ccfbf1;
  color: #0f766e;
}

.scenario-role {
  font-size: var(--text-xl);
  font-weight: 700;
}

.scenario-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

/* ======== 练习区域 ======== */
.run-area {
  margin-top: var(--space-md);
  display: grid;
  gap: var(--space-md);
}

/* ======== 场景描述头卡片 ======== */
.scenario-header-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.scenario-color-bar {
  height: 3px;
  width: 100%;
  background: var(--color-part-b);
}

.scenario-header-body {
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
}

.scenario-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.scenario-header-info {
  display: grid;
  gap: var(--space-xs);
  flex: 1;
}

.scenario-role-emoji {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
}

.scenario-text {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

/* 计时器 */
.scenario-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  min-width: 80px;
  flex-shrink: 0;
}
.timer-urgent {
  background: #fef2f2;
  border-color: #fecaca;
}
.timer-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.timer-value {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}
.timer-urgent .timer-value {
  color: #b91c1c;
}
.timer-unit {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.scenario-meta {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}
.meta-item {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.scenario-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.voice-warn {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: var(--text-sm);
}

/* ======== Q&A 环节 ======== */
.qa-section {
  display: grid;
  gap: var(--space-md);
}

/* 对话原文卡 */
.dialogue-card {
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
}

.dialogue-title {
  font-size: var(--text-lg);
  font-weight: 700;
}

.dialogue-hint {
  font-size: var(--text-sm);
}

.dialogue-text {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 14px 16px;
  font-size: var(--text-sm);
  line-height: 1.8;
  white-space: pre-wrap;
  font-style: italic;
  color: var(--color-text);
}

.qa-section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
}

.qa-cards {
  display: grid;
  gap: var(--space-sm);
}

/* 单张 Q&A 卡片 */
.qa-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: grid;
  gap: var(--space-sm);
  transition: border-color var(--duration-fast),
              box-shadow var(--duration-fast);
}
.qa-active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px rgba(15, 118, 110, 0.2);
}

.qa-card-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}

.qa-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.qa-num-done {
  background: #dcfce7;
  border-color: #bbf7d0;
  color: #166534;
}

.qa-prompt {
  color: var(--color-text);
  font-size: var(--text-sm);
  line-height: 1.5;
}

/* 参考折叠 */
.qa-ref {
  font-size: var(--text-sm);
}

.qa-ref-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  user-select: none;
}
.qa-ref-btn::-webkit-details-marker {
  display: none;
}
.qa-ref-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.qa-ref-content {
  margin-top: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-sm);
  color: #166534;
  font-size: var(--text-sm);
  line-height: 1.6;
}

/* Textarea & Voice */
.qa-card textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px;
  resize: vertical;
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: 1.6;
  transition: border-color var(--duration-fast);
}
.qa-card textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.btn-voice {
  justify-self: start;
  padding: 6px 12px;
  font-size: var(--text-xs);
}

/* ======== 环节分隔 ======== */
.stage-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-divider .divider {
  margin: 0;
  flex: 1;
}

.stage-label {
  position: absolute;
  background: var(--color-bg);
  padding: 0 var(--space-md);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ======== 提交按钮 ======== */
.btn-submit {
  justify-self: start;
  margin-top: var(--space-sm);
}

/* ======== 响应式 ======== */
@media (max-width: 767px) {
  .scenario-header-top {
    flex-direction: column;
  }

  .scenario-timer {
    flex-direction: row;
    gap: var(--space-sm);
    align-self: stretch;
  }

  .scenario-actions {
    flex-direction: column;
  }

  .scenario-meta {
    flex-direction: column;
    gap: var(--space-xs);
  }
}
</style>
