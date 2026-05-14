<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { partCStories } from '@/data/examContent'
import { scorePartC } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'
import { useSpeechSynthesis } from '@/composables/useSpeechSynthesis'
import { useTimer } from '@/composables/useTimer'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const recognition = useSpeechRecognition()
const tts = useSpeechSynthesis()
const prepTimer = useTimer()
const retellTimer = useTimer()

const manualTranscript = ref('')
const statusMessage = ref('请选择故事开始自动流程。')
const flowStage = ref<'idle' | 'playing-first' | 'playing-second' | 'prepare' | 'retell' | 'done'>('idle')
const flowActive = ref(false)

const selectedStory = computed(() =>
  partCStories.find((item) => item.id === route.params.id)
)
const prepareRemaining = computed(() => prepTimer.remainingSeconds.value)
const retellElapsed = computed(() => retellTimer.elapsedSeconds.value)
const combinedTranscript = computed(() =>
  [recognition.transcript.value, manualTranscript.value].join(' ').trim()
)
const canSubmit = computed(() => combinedTranscript.value.length > 0)

watch(selectedStory, (story) => {
  if (!story) {
    stopAll()
    flowStage.value = 'idle'
    statusMessage.value = '请选择故事开始自动流程。'
    return
  }
  void startAutoFlow()
})

watch(
  () => prepTimer.remainingSeconds.value,
  (remaining) => {
    if (flowStage.value === 'prepare' && remaining === 0 && !prepTimer.isRunning.value) {
      startRetellPhase()
    }
  }
)

function chooseStory(id: string) {
  router.push(`/practice/part-c/${id}`)
}

function resetTranscripts() {
  manualTranscript.value = ''
  recognition.transcript.value = ''
  recognition.interimTranscript.value = ''
}

function stopAll() {
  flowActive.value = false
  prepTimer.stop()
  retellTimer.stop()
  recognition.stop()
  tts.stop()
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function playStory(rate: number) {
  if (!selectedStory.value) return
  await tts.speak(selectedStory.value.storyText, { lang: 'en-US', rate })
}

function startPreparePhase() {
  flowStage.value = 'prepare'
  statusMessage.value = '准备时间 1 分钟，请整理关键词。'
  prepTimer.reset()
  prepTimer.setDuration(60)
  prepTimer.start()
}

function startRetellPhase() {
  prepTimer.stop()
  flowStage.value = 'retell'
  statusMessage.value = '开始复述，系统正在实时转写...'
  retellTimer.reset()
  retellTimer.start()
  recognition.start()
}

async function startAutoFlow() {
  if (!selectedStory.value) {
    return
  }
  stopAll()
  resetTranscripts()
  flowActive.value = true

  try {
    flowStage.value = 'playing-first'
    statusMessage.value = '第一遍播放中（1.0x）...'
    await playStory(1)
    if (!flowActive.value) return

    statusMessage.value = '第一遍结束，准备第二遍...'
    await delay(800)
    if (!flowActive.value) return

    flowStage.value = 'playing-second'
    statusMessage.value = '第二遍播放中（0.9x）...'
    await playStory(0.9)
    if (!flowActive.value) return

    startPreparePhase()
  } catch {
    statusMessage.value = '自动播放失败，请使用手动按钮继续流程。'
    flowStage.value = 'idle'
  }
}

function replayStoryTwice() {
  void startAutoFlow()
}

function startPrepareManually() {
  stopAll()
  startPreparePhase()
}

function startRetellManually() {
  stopAll()
  startRetellPhase()
}

function stopRetell() {
  recognition.stop()
  retellTimer.stop()
  flowStage.value = 'done'
  statusMessage.value = '复述已停止，可手动补充后提交评分。'
}

function submit() {
  if (!selectedStory.value || !combinedTranscript.value.trim()) {
    return
  }
  stopRetell()
  const result = scorePartC({
    story: selectedStory.value,
    transcript: combinedTranscript.value.trim(),
    durationSeconds: Math.max(retellElapsed.value, 45),
  })

  const attempt: ExamAttempt = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mode: 'practice',
    partResults: [result],
    totalScore: result.score.overall,
    totalDuration: result.duration,
    partDurations: { C: result.duration },
  }

  examStore.currentAttempt = attempt
  examStore.partResults = [result]
  saveAttemptToCache(attempt)
  router.push({ name: 'result', params: { attemptId: attempt.id } })
}

onBeforeUnmount(() => {
  stopAll()
})
</script>

<template>
  <!-- ======== 页面头部 ======== -->
  <section class="card partc-head">
    <h1>Part C - 故事复述</h1>
    <p class="text-secondary">选择故事后将自动播放两遍并进入准备倒计时。</p>
  </section>

  <!-- ======== 故事选择态 ======== -->
  <section v-if="!selectedStory" class="story-grid">
    <article
      v-for="item in partCStories"
      :key="item.id"
      class="story-select-card"
    >
      <span class="story-badge">Part C</span>
      <h2 class="story-title">{{ item.title }}</h2>
      <p class="story-difficulty">
        <span class="stars">{{ '⭐'.repeat(item.difficulty) }}</span>
        <span class="word-count">{{ item.wordCount }} 词</span>
      </p>
      <p class="story-hint">{{ item.frameworkHint }}</p>
      <button class="btn-primary" @click="chooseStory(item.id)">选择故事</button>
    </article>
  </section>

  <!-- ======== 练习态 ======== -->
  <section v-else class="run-area">
    <!-- 故事标题 + 框架提示 -->
    <article class="story-header-card">
      <div class="story-color-bar"></div>
      <div class="story-header-body">
        <h2 class="story-header-title">{{ selectedStory.title }}</h2>
        <p class="story-meta">
          <span class="stars">{{ '⭐'.repeat(selectedStory.difficulty) }}</span>
          <span class="word-count">{{ selectedStory.wordCount }} 词</span>
        </p>
        <div class="framework-card">
          <span class="framework-label">📋 框架提示</span>
          <p class="framework-text">{{ selectedStory.frameworkHint }}</p>
        </div>
      </div>
    </article>

    <!-- 故事原文（折叠） -->
    <details class="story-text-details">
      <summary class="story-text-btn">📖 查看故事原文</summary>
      <div class="story-text-content">
        <p>{{ selectedStory.storyText }}</p>
      </div>
    </details>

    <!-- 播放控制 -->
    <article class="play-controls">
      <h3 class="controls-title">🎧 听力播放</h3>
      <div class="play-buttons">
        <button
          class="play-btn play-btn-first"
          @click="playStory(1)"
          :disabled="flowStage === 'playing-first' || flowStage === 'playing-second'"
        >
          🔊 播放故事（第一遍）
        </button>
        <button
          class="play-btn play-btn-second"
          @click="playStory(0.9)"
          :disabled="flowStage === 'playing-first' || flowStage === 'playing-second'"
        >
          🔉 播放故事（第二遍 · 慢速）
        </button>
      </div>
      <p class="status-msg">{{ statusMessage }}</p>
    </article>

    <!-- 计时器 + 手动控制 -->
    <article class="timer-controls">
      <div class="timer-display">
        <div v-if="flowStage === 'prepare'" class="timer-box timer-prepare">
          <span class="timer-label-text">准备倒计时</span>
          <span class="timer-big">{{ prepareRemaining }}</span>
          <span class="timer-unit-text">秒</span>
        </div>
        <div v-if="flowStage === 'retell' || flowStage === 'done'" class="timer-box timer-retell">
          <span class="timer-label-text">复述用时</span>
          <span class="timer-big">{{ retellElapsed }}</span>
          <span class="timer-unit-text">秒</span>
        </div>
      </div>
      <div class="manual-actions">
        <button class="btn-secondary" @click="replayStoryTwice">手动重播两遍</button>
        <button class="btn-secondary" @click="startPrepareManually">手动开始准备倒计时</button>
        <button class="btn-secondary" @click="startRetellManually">手动进入复述</button>
        <button
          class="btn-secondary"
          @click="stopRetell"
          :disabled="flowStage !== 'retell'"
        >
          停止复述
        </button>
      </div>
    </article>

    <p v-if="!recognition.supported" class="voice-warn">
      浏览器语音识别不可用，请直接在下方文本框输入复述内容。
    </p>

    <!-- 实时转写 + 手动输入 -->
    <article class="transcript-area card">
      <h3 class="transcript-title">🎙 实时转写</h3>
      <div class="transcript-preview">
        {{ recognition.transcript || '（等待语音输入）' }}
      </div>
      <p v-if="recognition.interimTranscript" class="transcript-interim">
        {{ recognition.interimTranscript }}
      </p>

      <h3 class="transcript-title">✏️ 手动补充</h3>
      <textarea
        v-model="manualTranscript"
        rows="10"
        placeholder="可手动补充复述文本，或直接完整输入你的复述..."
      ></textarea>

      <button
        class="btn-primary btn-submit"
        @click="submit"
        :disabled="!canSubmit"
      >
        提交并生成诊断
      </button>
    </article>
  </section>
</template>

<style scoped>
/* ======== 页面头部 ======== */
.partc-head {
  display: grid;
  gap: var(--space-sm);
}

/* ======== 故事选择网格 ======== */
.story-grid {
  margin-top: var(--space-md);
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.story-select-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
}
.story-select-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.story-badge {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  background: #ffedd5;
  color: #c2410c;
}

.story-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.story-difficulty {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.stars {
  letter-spacing: 2px;
}

.word-count {
  font-weight: 600;
  color: var(--color-text-muted);
}

.story-hint {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
}

/* ======== 练习区域 ======== */
.run-area {
  margin-top: var(--space-md);
  display: grid;
  gap: var(--space-md);
}

/* ======== 故事标题头卡片 ======== */
.story-header-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.story-color-bar {
  height: 3px;
  width: 100%;
  background: var(--color-part-c);
}

.story-header-body {
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
}

.story-header-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.story-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* 框架提示卡片 */
.framework-card {
  margin-top: var(--space-xs);
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: grid;
  gap: var(--space-xs);
}

.framework-label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: #c2410c;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.framework-text {
  color: #7c2d12;
  font-size: var(--text-sm);
  line-height: 1.6;
}

/* ======== 故事原文折叠 ======== */
.story-text-details {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.story-text-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: var(--color-surface-hover);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  list-style: none;
  user-select: none;
  transition: background var(--duration-fast);
}
.story-text-btn::-webkit-details-marker {
  display: none;
}
.story-text-btn:hover {
  background: #e6f0ec;
  color: var(--color-primary);
}

.story-text-content {
  padding: var(--space-md);
  background: #fafafa;
  border-top: 1px solid var(--color-border);
}
.story-text-content p {
  font-size: var(--text-sm);
  line-height: 1.9;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
}

/* ======== 播放控制 ======== */
.play-controls {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
}

.controls-title {
  font-size: var(--text-base);
  font-weight: 700;
}

.play-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.play-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 2px solid;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-expo);
}
.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn-first {
  background: #eff6ff;
  border-color: #93c5fd;
  color: #1e40af;
}
.play-btn-first:hover:not(:disabled) {
  background: #dbeafe;
  border-color: #60a5fa;
}

.play-btn-second {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #92400e;
}
.play-btn-second:hover:not(:disabled) {
  background: #fef9c3;
  border-color: #fbbf24;
}

.status-msg {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
  padding: 8px 12px;
  background: var(--color-surface-hover);
  border-radius: var(--radius-sm);
}

/* ======== 计时器 + 手动控制 ======== */
.timer-controls {
  display: grid;
  gap: var(--space-md);
}

.timer-display {
  display: flex;
  justify-content: center;
}

.timer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 28px;
  border-radius: var(--radius-lg);
  border: 2px solid;
  min-width: 140px;
}

.timer-prepare {
  background: #eff6ff;
  border-color: #93c5fd;
}

.timer-retell {
  background: #fef3c7;
  border-color: #fcd34d;
}

.timer-label-text {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.timer-big {
  font-size: var(--text-hero);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.timer-unit-text {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.manual-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}

/* ======== 语音警告 ======== */
.voice-warn {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: var(--text-sm);
}

/* ======== 转写 + 输入区域 ======== */
.transcript-area {
  display: grid;
  gap: var(--space-md);
}

.transcript-title {
  font-size: var(--text-base);
  font-weight: 700;
}

.transcript-preview {
  background: #fafafa;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--color-text-secondary);
  min-height: 60px;
}

.transcript-interim {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-style: italic;
  padding: 0 var(--space-sm);
}

.transcript-area textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  resize: vertical;
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: 1.7;
  transition: border-color var(--duration-fast);
}
.transcript-area textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.btn-submit {
  justify-self: start;
}

/* ======== 响应式 ======== */
@media (max-width: 767px) {
  .play-buttons {
    flex-direction: column;
  }

  .manual-actions {
    flex-direction: column;
  }

  .manual-actions .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>
