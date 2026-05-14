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
  <section class="card head">
    <h1>Part C - 故事复述</h1>
    <p class="text-secondary">选择故事后将自动播放两遍并进入准备倒计时。</p>
  </section>

  <section v-if="!selectedStory" class="grid">
    <article v-for="item in partCStories" :key="item.id" class="card story-card">
      <h2>{{ item.title }}</h2>
      <p class="text-secondary">难度 {{ item.difficulty }} · {{ item.wordCount }} 词</p>
      <p class="text-secondary">提示：{{ item.frameworkHint }}</p>
      <button class="btn-primary" @click="chooseStory(item.id)">选择故事</button>
    </article>
  </section>

  <section v-else class="run-area">
    <article class="card">
      <h2>{{ selectedStory.title }}</h2>
      <p class="text-secondary">框架提示：{{ selectedStory.frameworkHint }}</p>
      <p class="status">{{ statusMessage }}</p>
      <p v-if="flowStage === 'prepare'" class="timer">还剩 {{ prepareRemaining }} 秒</p>
      <p v-if="flowStage === 'retell' || flowStage === 'done'" class="timer">
        复述用时：{{ retellElapsed }} 秒
      </p>
      <div class="actions">
        <button class="btn-secondary" @click="replayStoryTwice">手动重播两遍</button>
        <button class="btn-secondary" @click="startPrepareManually">手动开始准备倒计时</button>
        <button class="btn-secondary" @click="startRetellManually">手动进入复述</button>
        <button class="btn-secondary" @click="stopRetell" :disabled="flowStage !== 'retell'">停止复述</button>
      </div>
      <p v-if="!recognition.supported" class="warn">
        浏览器语音识别不可用，请直接在下方 textarea 输入复述内容。
      </p>
    </article>

    <article class="card">
      <h3>实时转写</h3>
      <p class="preview">{{ recognition.transcript || '（等待语音输入）' }}</p>
      <p class="preview interim" v-if="recognition.interimTranscript">
        {{ recognition.interimTranscript }}
      </p>
      <h3>手动补充</h3>
      <textarea
        v-model="manualTranscript"
        rows="10"
        placeholder="可手动补充复述文本，或直接完整输入你的复述..."
      />
      <button class="btn-primary" @click="submit" :disabled="!canSubmit">提交并生成诊断</button>
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

.story-card {
  display: grid;
  gap: 8px;
}

.run-area {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.status {
  margin-top: 8px;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.timer {
  margin-top: 8px;
  font-weight: 700;
}

.warn {
  color: #92400e;
  background: #ffedd5;
  border: 1px solid #fdba74;
  border-radius: var(--radius-sm);
  padding: 8px 10px;
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
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px;
  resize: vertical;
  font-family: inherit;
}
</style>

