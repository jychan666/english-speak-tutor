<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { partCStories } from '@/data/examContent'
import { scorePartC } from '@/engine/scoring'
import { useExamStore } from '@/stores/useExamStore'
import type { ExamAttempt } from '@/types/scoring'
import { saveAttemptToCache } from '@/utils/attemptCache'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

const transcript = ref('')
const durationSeconds = ref(0)
const running = ref(false)
let timer: number | null = null

const selectedStory = computed(() =>
  partCStories.find((item) => item.id === route.params.id)
)

watch(selectedStory, () => {
  transcript.value = ''
  durationSeconds.value = 0
  stopTimer()
})

function chooseStory(id: string) {
  router.push(`/practice/part-c/${id}`)
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

function speak(text: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve()
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = rate
    utterance.onend = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

async function playStoryTwice() {
  if (!selectedStory.value || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  await speak(selectedStory.value.storyText, 1)
  await speak(selectedStory.value.storyText, 0.9)
}

function submit() {
  if (!selectedStory.value || !transcript.value.trim()) {
    return
  }
  stopTimer()
  const result = scorePartC({
    story: selectedStory.value,
    transcript: transcript.value.trim(),
    durationSeconds: Math.max(durationSeconds.value, 45),
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
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
})
</script>

<template>
  <section class="card head">
    <h1>Part C - 故事复述</h1>
    <p class="text-secondary">听两遍故事后复述。先抓“人物-事件-结果”，再补细节。</p>
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
      <div class="actions">
        <button class="btn-secondary" @click="playStoryTwice">播放故事（两遍）</button>
        <button class="btn-primary" @click="startTimer" :disabled="running">开始复述计时</button>
        <button class="btn-secondary" @click="stopTimer" :disabled="!running">暂停计时</button>
      </div>
      <p class="timer">复述时长：{{ durationSeconds }} 秒</p>
    </article>

    <article class="card">
      <h3>你的复述内容</h3>
      <textarea
        v-model="transcript"
        rows="10"
        placeholder="请用英文复述故事内容..."
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

.story-card {
  display: grid;
  gap: 8px;
}

.run-area {
  margin-top: 16px;
  display: grid;
  gap: 12px;
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

textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px;
  resize: vertical;
  font-family: inherit;
}
</style>
