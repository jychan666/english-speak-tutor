import type { ExamAttempt } from '@/types/scoring'

const CACHE_PREFIX = 'es-attempt:'

export function saveAttemptToCache(attempt: ExamAttempt): void {
  if (typeof sessionStorage === 'undefined') {
    return
  }
  sessionStorage.setItem(`${CACHE_PREFIX}${attempt.id}`, JSON.stringify(attempt))
}

export function getAttemptFromCache(id: string): ExamAttempt | null {
  if (typeof sessionStorage === 'undefined') {
    return null
  }
  const raw = sessionStorage.getItem(`${CACHE_PREFIX}${id}`)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as ExamAttempt
  } catch {
    return null
  }
}

