import { Router } from 'express'
import { listAttempts, upsertAttempt } from '../db/database'
import type { StoredAttempt } from '../types/attempt'

function isValidAttempt(input: unknown): input is StoredAttempt {
  if (!input || typeof input !== 'object') return false
  const attempt = input as Partial<StoredAttempt>
  return Boolean(
    attempt.id &&
      attempt.date &&
      (attempt.mode === 'practice' || attempt.mode === 'mock') &&
      typeof attempt.totalScore === 'number' &&
      typeof attempt.totalDuration === 'number' &&
      Array.isArray(attempt.partResults)
  )
}

const router = Router()

router.get('/progress', (req, res) => {
  const attempts = listAttempts(req.deviceToken, 100)

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((sum, item) => sum + item.totalScore, 0) / attempts.length)
    : 0

  const partAScores = attempts
    .flatMap((attempt) => attempt.partResults.filter((part) => part.part === 'A'))
    .map((part) => Number(part.score.overall) || 0)
  const partBScores = attempts
    .flatMap((attempt) => attempt.partResults.filter((part) => part.part === 'B'))
    .map((part) => Number(part.score.overall) || 0)
  const partCScores = attempts
    .flatMap((attempt) => attempt.partResults.filter((part) => part.part === 'C'))
    .map((part) => Number(part.score.overall) || 0)

  res.json({
    success: true,
    data: {
      totalAttempts: attempts.length,
      avgScore,
      partAScores,
      partBScores,
      partCScores,
      recentAttempts: attempts.slice(0, 20),
    },
  })
})

router.post('/progress/attempts', (req, res) => {
  if (!isValidAttempt(req.body)) {
    res.status(400).json({
      success: false,
      error: 'Invalid attempt payload',
    })
    return
  }

  const attempt = req.body
  upsertAttempt(req.deviceToken, attempt)

  res.json({
    success: true,
    data: { id: attempt.id },
  })
})

export default router
