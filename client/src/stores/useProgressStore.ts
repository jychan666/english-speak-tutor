import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ExamAttempt } from '@/types/scoring'
import type { SkillProfile } from '@/types/learning'
import { api } from '@/utils/api'

const LOCAL_ATTEMPTS_KEY = 'english-speak-attempts'

function loadLocalAttempts(): ExamAttempt[] {
  if (typeof localStorage === 'undefined') {
    return []
  }
  const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY)
  if (!raw) {
    return []
  }
  try {
    const parsed = JSON.parse(raw) as ExamAttempt[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocalAttempts(attempts: ExamAttempt[]) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(attempts))
}

function computeProfile(attempts: ExamAttempt[]): SkillProfile {
  if (attempts.length === 0) {
    return {
      pronunciation: 0,
      fluency: 0,
      grammar: 0,
      vocabulary: 0,
      contentRetention: 0,
      updatedAt: new Date().toISOString(),
    }
  }

  const buckets = {
    pronunciation: [] as number[],
    fluency: [] as number[],
    grammar: [] as number[],
    vocabulary: [] as number[],
    contentRetention: [] as number[],
  }

  for (const attempt of attempts) {
    for (const part of attempt.partResults) {
      if ('accuracy' in part.score) {
        buckets.pronunciation.push(part.score.accuracy)
        buckets.fluency.push(part.score.fluency)
      } else if ('questionGrammar' in part.score) {
        buckets.grammar.push(part.score.questionGrammar)
        buckets.fluency.push(part.score.answerFluency)
        buckets.contentRetention.push(part.score.answerAccuracy)
      } else {
        buckets.contentRetention.push(part.score.contentCoverage)
        buckets.grammar.push(part.score.coherence)
        buckets.vocabulary.push(part.score.languageUse)
        buckets.fluency.push(part.score.fluency)
      }
    }
  }

  const avg = (items: number[]) =>
    items.length ? Math.round(items.reduce((sum, item) => sum + item, 0) / items.length) : 0

  return {
    pronunciation: avg(buckets.pronunciation),
    fluency: avg(buckets.fluency),
    grammar: avg(buckets.grammar),
    vocabulary: avg(buckets.vocabulary),
    contentRetention: avg(buckets.contentRetention),
    updatedAt: new Date().toISOString(),
  }
}

export const useProgressStore = defineStore('progress', () => {
  const attempts = ref<ExamAttempt[]>([])
  const loading = ref(false)
  const skillProfile = ref<SkillProfile>({
    pronunciation: 0,
    fluency: 0,
    grammar: 0,
    vocabulary: 0,
    contentRetention: 0,
    updatedAt: '',
  })

  const totalAttempts = computed(() => attempts.value.length)

  const avgScore = computed(() => {
    if (attempts.value.length === 0) return 0
    return Math.round(
      attempts.value.reduce((s, a) => s + a.totalScore, 0) / attempts.value.length
    )
  })

  const recentAttempts = computed(() => {
    return attempts.value
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  })

  async function fetchProgress() {
    loading.value = true
    try {
      const res = await api.get('/api/progress')
      if (res.data?.success) {
        attempts.value = res.data.data.recentAttempts || []
        saveLocalAttempts(attempts.value)
      } else {
        attempts.value = loadLocalAttempts()
      }
    } catch {
      // Fall back to local cache when API is unavailable.
      attempts.value = loadLocalAttempts()
    } finally {
      loading.value = false
    }
  }

  async function saveAttempt(attempt: ExamAttempt) {
    if (attempts.value.some((item) => item.id === attempt.id)) {
      return
    }

    attempts.value.unshift(attempt)
    attempts.value = attempts.value
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 100)
    saveLocalAttempts(attempts.value)

    try {
      await api.post('/api/progress/attempts', attempt)
    } catch (e) {
      console.warn('Save to API failed, already cached locally:', e)
    } finally {
      skillProfile.value = computeProfile(attempts.value)
    }
  }

  async function fetchSkillProfile() {
    try {
      const res = await api.get('/api/skills/profile')
      if (res.data?.success) {
        skillProfile.value = res.data.data
        return
      }
    } catch {
      // Fall back to local profile
    }
    if (!attempts.value.length) {
      attempts.value = loadLocalAttempts()
    }
    skillProfile.value = computeProfile(attempts.value)
  }

  return {
    attempts,
    loading,
    skillProfile,
    totalAttempts,
    avgScore,
    recentAttempts,
    fetchProgress,
    saveAttempt,
    fetchSkillProfile,
  }
})
