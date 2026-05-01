import { initDbSchema, listAttempts, upsertAttempt } from './database'
import type { StoredAttempt } from '../types/attempt'

initDbSchema()
const sampleExists = listAttempts(500).find((item) => item.id === 'sample-attempt-1')

if (!sampleExists) {
  const sampleAttempt: StoredAttempt = {
    id: 'sample-attempt-1',
    date: new Date().toISOString(),
    mode: 'practice',
    totalScore: 76,
    totalDuration: 380,
    partResults: [
      {
        part: 'A',
        score: {
          accuracy: 78,
          fluency: 74,
          intonation: 76,
          overall: 76,
          details: {},
        },
        transcript: 'sample transcript',
        duration: 120,
        diagnosticReport: {
          overallLevel: 'good',
          strengths: ['输出稳定'],
          weaknesses: ['发音可继续提升'],
          specificErrors: [],
          recommendedArticles: ['pr-th-sound'],
          recommendedPractice: ['再练一篇 Part A 同难度材料'],
        },
      },
    ],
  }

  upsertAttempt(sampleAttempt)
}

console.log('Seed completed.')
