import { Router } from 'express'
import { listAttempts } from '../db/database'
import type { StoredAttempt } from '../types/attempt'

function readAttempts(token?: string): StoredAttempt[] {
  return listAttempts(token, 200)
}

function average(values: number[]): number {
  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

const router = Router()

router.get('/skills/profile', (req, res) => {
  const attempts = readAttempts(req.deviceToken)

  const pronunciation: number[] = []
  const fluency: number[] = []
  const grammar: number[] = []
  const vocabulary: number[] = []
  const contentRetention: number[] = []

  for (const attempt of attempts) {
    for (const part of attempt.partResults) {
      if ('accuracy' in part.score) {
        pronunciation.push(Number(part.score.accuracy) || 0)
        fluency.push(Number(part.score.fluency) || 0)
      } else if ('questionGrammar' in part.score) {
        grammar.push(Number(part.score.questionGrammar) || 0)
        fluency.push(Number(part.score.answerFluency) || 0)
        contentRetention.push(Number(part.score.answerAccuracy) || 0)
      } else {
        contentRetention.push(Number(part.score.contentCoverage) || 0)
        grammar.push(Number(part.score.coherence) || 0)
        vocabulary.push(Number(part.score.languageUse) || 0)
        fluency.push(Number(part.score.fluency) || 0)
      }
    }
  }

  res.json({
    success: true,
    data: {
      pronunciation: average(pronunciation),
      fluency: average(fluency),
      grammar: average(grammar),
      vocabulary: average(vocabulary),
      contentRetention: average(contentRetention),
      updatedAt: new Date().toISOString(),
    },
  })
})

export default router
