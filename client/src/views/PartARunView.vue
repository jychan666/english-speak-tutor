<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { partAPassages } from '@/data/examContent'
import { scorePartA } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'
import { useSpeechSynthesis } from '@/composables/useSpeechSynthesis'
import { useAudioRecorder } from '@/composables/useAudioRecorder'
import { useTimer } from '@/composables/useTimer'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const speech = useSpeechRecognition()
const tts = useSpeechSynthesis()
const recorder = useAudioRecorder()
const timer = useTimer()

const manualTranscript = ref('')
const autoSubmitted = ref(false)
const submitHint = ref('')
const submitting = ref(false)
const hasPlayedDemo = ref(false)
const practiceActive = ref(false)
const showManualInput = ref(false)
let autoSubmitHandle: ReturnType<typeof setTimeout> | null = null

const selectedPassage = computed(() =>
  partAPassages.find((item) => item.id === route.params.id)
)
const running = computed(() => timer.isRunning.value)
const durationSeconds = computed(() => timer.elapsedSeconds.value)
const recordingError = computed(() => recorder.error.value)
const recordingUrl = computed(() => recorder.audioUrl.value)
const recorderSupported = computed(() => recorder.supported)

function choosePassage(id: string) {
  router.push(`/practice/part-a/${id}`)
}

function clearAutoSubmit() {
  if (autoSubmitHandle) {
    clearTimeout(autoSubmitHandle)
    autoSubmitHandle = null
  }
}

async function playDemo() {
  if (!selectedPassage.value || tts.speaking.value) return
  try {
    await tts.speak(selectedPassage.value.passage, { lang: 'en-US', rate: 0.92 })
  } catch {
    // Keep silent fallback
  } finally {
    hasPlayedDemo.value = true
  }
}

function stopDemo() {
  tts.stop()
}

function toggleDemo() {
  if (tts.paused.value) {
    tts.resume()
  } else {
    tts.pause()
  }
}

function scheduleAutoSubmit() {
  if (!speech.supported || autoSubmitted.value || submitting.value || !practiceActive.value) return
  clearAutoSubmit()
  submitHint.value = '识别已结束，2 秒后自动评分...'
  autoSubmitHandle = setTimeout(() => {
    void submit(true)
  }, 2000)
}

function stopPractice(scheduleAuto = false) {
  practiceActive.value = false
  if (speech.listening.value) speech.stop()
  timer.stop()
  if (recorder.recording.value) recorder.stop()
  if (scheduleAuto) scheduleAutoSubmit()
}

function resetForRetry() {
  submitHint.value = ''
  autoSubmitted.value = false
  clearAutoSubmit()
}

function startPractice() {
  resetForRetry()
  manualTranscript.value = ''
  timer.reset()
  timer.start()
  practiceActive.value = true
  speech.start()
  if (recorderSupported.value) recorder.start()
}

async function waitForRecordingUrl(): Promise<string | undefined> {
  if (!recorderSupported.value) return undefined
  const startTime = Date.now()
  while (recorder.recording.value && Date.now() - startTime < 2000) {
    await new Promise((resolve) => setTimeout(resolve, 60))
  }
  return recorder.audioUrl.value ?? undefined
}

async function submit(fromAuto = false) {
  if (!selectedPassage.value || submitting.value) return
  submitting.value = true
  clearAutoSubmit()
  stopPractice(false)
  const transcript = [speech.transcript.value, manualTranscript.value].join(' ').trim()
  if (!transcript) { submitting.value = false; return }
  const recordingUrl = await waitForRecordingUrl()
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
    recordings: recordingUrl ? { A: recordingUrl } : undefined,
    partDurations: { A: result.duration },
  }

  autoSubmitted.value = fromAuto
  examStore.currentAttempt = attempt
  examStore.partResults = [result]
  saveAttemptToCache(attempt)
  submitting.value = false
  router.push({ name: 'result', params: { attemptId: attempt.id } })
}

watch(
  () => speech.listening.value,
  (listening, prev) => {
    if (prev && !listening && practiceActive.value) scheduleAutoSubmit()
  }
)

watch(selectedPassage, () => {
  resetForRetry()
  timer.reset()
  manualTranscript.value = ''
  showManualInput.value = false
})

onBeforeUnmount(() => {
  clearAutoSubmit()
  stopPractice(false)
  tts.stop()
})
</script>

<template>
  <section class="page-head">
    <span class="part-badge">Part A</span>
    <div class="head-text">
      <h1>模仿朗读</h1>
      <p class="text-secondary">听示范 → 准备 1 分钟 → 开口朗读 → 查看诊断。</p>
    </div>
  </section>

  <!-- ========== 选择文章 ========== -->
  <section v-if="!selectedPassage" class="passage-grid">
    <article
      v-for="(item, idx) in partAPassages"
      :key="item.id"
      class="card passage-card"
      @click="choosePassage(item.id)"
    >
      <div class="card-top">
        <span class="card-index">#{{ idx + 1 }}</span>
        <span class="card-topic">{{ item.topic }}</span>
      </div>
      <h2 class="card-title">{{ item.title }}</h2>
      <div class="card-meta">
        <span class="stars">
          <span v-for="s in 3" :key="s" :class="{ filled: s <= item.difficulty }">★</span>
        </span>
        <span class="word-count">{{ item.wordCount }} 词</span>
      </div>
    </article>
  </section>

  <!-- ========== 练习中 ========== -->
  <section v-else class="run-area">
    <!-- 不支持语音提示 -->
    <div v-if="!speech.supported" class="warn-banner">
      <span>⚠ 当前浏览器不支持语音识别，请使用 Chrome 或 Edge。你可以切换至手动输入模式继续练习。</span>
    </div>
    <div v-if="recordingError" class="warn-banner">{{ recordingError }}</div>

    <!-- 短文展示区 -->
    <article class="card passage-read">
      <p class="passage-text">{{ selectedPassage.passage }}</p>
    </article>

    <!-- 操作控制区 -->
    <article class="card controls-card">
      <div class="controls-row">
        <div class="timer-display" :class="{ running }">
          <span class="timer-icon">⏱</span>
          <span class="timer-value">{{ durationSeconds }}</span>
          <span class="timer-label">秒</span>
        </div>
        <div class="button-group">
          <!-- TTS 播放控制 -->
          <template v-if="tts.speaking">
            <button class="btn-secondary btn-sm" @click="toggleDemo">
              {{ tts.paused ? '▶ 继续播放' : '⏸ 暂停' }}
            </button>
            <button class="btn-danger-outline btn-sm" @click="stopDemo">
              ⏹ 停止
            </button>
          </template>
          <button v-else class="btn-secondary btn-sm" @click="playDemo">
            🔊 {{ hasPlayedDemo ? '重播示范' : '播放示范' }}
          </button>

          <!-- 录音控制 -->
          <button
            class="btn-primary btn-sm btn-record"
            :class="{ pulsing: !running }"
            @click="startPractice"
            :disabled="running"
          >
            <span v-if="running">🎤 朗读中...</span>
            <span v-else>🎤 开始朗读</span>
          </button>
          <button class="btn-danger-outline btn-sm" @click="stopPractice(true)" :disabled="!running">
            ⏹ 停止
          </button>
        </div>
      </div>

      <!-- TTS 进度条 -->
      <div v-if="tts.speaking" class="tts-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${tts.progress}%` }"></div>
        </div>
        <span class="progress-label">示范朗读中...</span>
      </div>

      <p v-if="submitHint" class="hint">{{ submitHint }}</p>
      <p v-if="autoSubmitted" class="hint success">已自动提交评分。</p>
    </article>

    <!-- 实时转写 + 提交 -->
    <article class="card transcript-card">
      <h3 class="transcript-title">实时转写</h3>
      <div class="transcript-box final" v-if="speech.transcript">{{ speech.transcript }}</div>
      <div class="transcript-box interim" v-if="speech.interimTranscript">{{ speech.interimTranscript }}</div>
      <div class="transcript-box empty" v-if="!speech.transcript && !speech.interimTranscript">
        （等待语音输入...）
      </div>

      <!-- 手动输入折叠区（仅语音不可用时显示） -->
      <details v-if="!speech.supported || showManualInput" class="manual-section" :open="!speech.supported">
        <summary @click.prevent="showManualInput = !showManualInput">
          {{ showManualInput ? '收起手动输入 ▲' : '展开手动输入 ▼' }}
        </summary>
        <textarea
          v-model="manualTranscript"
          rows="5"
          placeholder="在这里手动输入你的朗读内容..."
        />
      </details>

      <button
        class="btn-primary btn-submit"
        @click="submit(false)"
        :disabled="submitting"
      >
        {{ submitting ? '正在评分...' : '提交并生成诊断' }}
      </button>
      <div v-if="recordingUrl" class="recording-preview">
        <p class="recording-label">录音预览：</p>
        <audio controls :src="recordingUrl ?? ''" />
      </div>
    </article>
  </section>
</template>

<style scoped>
/* ======== 页面头部 ======== */
.page-head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.part-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  margin-top: 4px;
  background: #e0f2fe;
  color: var(--color-part-a);
  border: 1px solid #bae6fd;
}

.head-text h1 {
  font-size: var(--text-3xl);
  font-weight: 800;
  line-height: 1.2;
}

.head-text p {
  margin-top: 4px;
}

/* ======== 选择文章网格 ======== */
.passage-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.passage-card {
  display: grid;
  gap: var(--space-sm);
  padding: 20px 24px;
  cursor: pointer;
}
.passage-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-part-a);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-index {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-part-a);
  background: #e0f2fe;
  padding: 1px 8px;
  border-radius: 999px;
}

.card-topic {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-surface-hover);
  padding: 2px 10px;
  border-radius: 999px;
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 700;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.stars span { color: var(--color-border); font-size: var(--text-sm); }
.stars span.filled { color: #eab308; }
.word-count { font-variant-numeric: tabular-nums; }

/* ======== 练习中布局 ======== */
.run-area {
  display: grid;
  gap: var(--space-md);
}

.warn-banner {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: var(--text-sm);
}

/* 短文展示区 */
.passage-read {
  padding: 24px;
}

.passage-text {
  background: #f8fafc;
  border: 1px solid var(--color-primary-light);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  line-height: 2;
  font-size: var(--text-lg);
  color: var(--color-text);
  white-space: pre-wrap;
  word-break: break-word;
}

/* 操作控制区 */
.controls-card {
  display: grid;
  gap: 10px;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.timer-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-variant-numeric: tabular-nums;
}

.timer-icon { font-size: 1.2rem; }

.timer-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-text);
  transition: color var(--duration-normal);
}
.timer-display.running .timer-value { color: var(--color-accent); }

.timer-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-danger-outline {
  background: #fef2f2;
  color: var(--color-error);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--duration-fast), border-color var(--duration-fast);
}
.btn-danger-outline:hover:not(:disabled) {
  background: #fee2e2;
  border-color: var(--color-error);
}
.btn-danger-outline:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(15, 118, 110, 0.35); }
  50% { box-shadow: 0 0 0 8px rgba(15, 118, 110, 0); }
}
.btn-record.pulsing { animation: pulse-glow 2s ease-in-out infinite; }

/* TTS 进度条 */
.tts-progress {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.progress-track {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
  transition: width 0.1s linear;
}

.progress-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.hint { color: var(--color-text-secondary); font-size: var(--text-sm); }
.hint.success { color: #047857; }

/* 转写区 */
.transcript-card {
  display: grid;
  gap: 12px;
}

.transcript-title {
  font-size: var(--text-lg);
  font-weight: 700;
}

.transcript-box {
  background: #f8fafc;
  border-radius: var(--radius-md);
  padding: 12px 14px;
  min-height: 44px;
  line-height: 1.7;
  font-size: var(--text-base);
  color: var(--color-text);
}

.transcript-box.empty {
  color: var(--color-text-muted);
  font-style: italic;
}

.transcript-box.interim {
  color: var(--color-text-secondary);
  font-style: italic;
  border: 1px dashed var(--color-border);
  background: #fafbfc;
}

/* 手动输入折叠 */
.manual-section {
  margin-top: 4px;
}
.manual-section summary {
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: 4px 0;
  user-select: none;
}
.manual-section textarea {
  width: 100%;
  margin-top: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  resize: vertical;
  font-family: inherit;
  font-size: var(--text-base);
  line-height: 1.6;
}
.manual-section textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 14px 32px;
  font-size: 1.1rem;
  border-radius: var(--radius-lg);
}

.recording-preview {
  display: grid;
  gap: 6px;
}
.recording-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: 600;
}

/* ======== 响应式 ======== */
@media (max-width: 767px) {
  .page-head { flex-direction: column; gap: var(--space-sm); }
  .head-text h1 { font-size: var(--text-2xl); }
  .passage-grid { grid-template-columns: 1fr; }
  .controls-row { flex-direction: column; align-items: flex-start; gap: var(--space-md); }
  .button-group { width: 100%; flex-direction: column; }
  .button-group button { width: 100%; text-align: center; }
  .passage-text { font-size: var(--text-base); }
}
</style>
