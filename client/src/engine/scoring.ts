import type { PartAPassage, PartBScenario, PartCStory } from '@/types/exam'
import type {
  DiagnosticReport,
  PartResult,
  PronunciationScore,
  RolePlayScore,
  StoryRetellScore,
} from '@/types/scoring'
import {
  clamp,
  estimateWordsPerMinute,
  keywordMatchPercentage,
  normalizeText,
  tokenize,
  wordOverlapRatio,
} from '@/utils/text'

type DiagnosticDimension = 'pronunciation' | 'fluency' | 'grammar' | 'vocabulary' | 'content'

interface DiagnosticInput {
  part: 'A' | 'B' | 'C'
  score: number
  hints: Array<{ dimension: DiagnosticDimension; detail: string; suggestion: string }>
}

const dimensionArticleMap: Record<DiagnosticDimension, string[]> = {
  pronunciation: ['pr-th-sound', 'pr-vw', 'pr-linking'],
  fluency: ['tp-stuck-rescue', 'tp-time-management', 'qa-part-a-30sec'],
  grammar: ['gr-question-order', 'gr-tense-safe', 'gr-connectors'],
  vocabulary: ['vo-campus', 'vo-travel', 'vo-environment'],
  content: ['tm-part-c-opening', 'tm-part-c-transition', 'tp-prep-minute'],
}

function toLevel(score: number): DiagnosticReport['overallLevel'] {
  if (score >= 85) return 'excellent'
  if (score >= 72) return 'good'
  if (score >= 60) return 'fair'
  return 'needs-work'
}

function buildDiagnostic(input: DiagnosticInput): DiagnosticReport {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const specificErrors = input.hints.map((hint) => ({
    type: hint.dimension,
    detail: hint.detail,
    suggestion: hint.suggestion,
    relatedArticleId: dimensionArticleMap[hint.dimension][0],
  }))

  if (input.score >= 80) {
    strengths.push('本次输出较稳定，核心信息表达清楚。')
  }

  const seenDimensions = new Set<DiagnosticDimension>()
  for (const hint of input.hints) {
    if (!seenDimensions.has(hint.dimension)) {
      weaknesses.push(hint.detail)
      seenDimensions.add(hint.dimension)
    }
  }

  const recommendedArticles = Array.from(seenDimensions)
    .flatMap((dimension) => dimensionArticleMap[dimension])
    .slice(0, 4)

  const recommendedPractice = [
    input.part === 'A' ? '再练一篇 Part A 同难度材料' : '',
    input.part === 'B' ? '重做一组 Part B 限时提问' : '',
    input.part === 'C' ? '再做一篇 Part C 关键词复述' : '',
  ].filter(Boolean)

  return {
    overallLevel: toLevel(input.score),
    strengths,
    weaknesses,
    specificErrors,
    recommendedArticles,
    recommendedPractice,
  }
}

function findMismatchedWords(expected: string[], spoken: string[]): Array<{ expected: string; recognized: string }> {
  const mismatches: Array<{ expected: string; recognized: string }> = []
  const len = Math.min(expected.length, spoken.length)
  for (let i = 0; i < len; i += 1) {
    if (expected[i] !== spoken[i]) {
      mismatches.push({ expected: expected[i], recognized: spoken[i] })
    }
    if (mismatches.length >= 8) {
      break
    }
  }
  return mismatches
}

function collectPhonemeHints(mismatches: Array<{ expected: string; recognized: string }>): string[] {
  const hints = new Set<string>()
  for (const pair of mismatches) {
    if (pair.expected.includes('th')) hints.add('/theta/')
    if (pair.expected.includes('v')) hints.add('/v/')
    if (pair.expected.includes('w')) hints.add('/w/')
    if (pair.expected.includes('r')) hints.add('/r/')
  }
  return Array.from(hints)
}

export function scorePartA(args: {
  passage: PartAPassage
  transcript: string
  durationSeconds: number
}): PartResult {
  const expectedWords = tokenize(args.passage.passage)
  const spokenWords = tokenize(args.transcript)
  const overlap = wordOverlapRatio(expectedWords, spokenWords)
  const accuracy = Math.round(overlap * 100)

  const wordsPerMinute = estimateWordsPerMinute(args.transcript, args.durationSeconds)
  const speedPenalty = Math.abs(wordsPerMinute - 125) * 0.28
  const lengthPenalty = spokenWords.length < expectedWords.length * 0.6 ? 18 : 0
  const fluency = Math.round(clamp(92 - speedPenalty - lengthPenalty))

  const avgSentenceLength = normalizeText(args.transcript).split(' ').length / Math.max(args.transcript.split('.').length, 1)
  const intonation = Math.round(clamp(62 + avgSentenceLength * 2.2))

  const overall = Math.round(accuracy * 0.5 + fluency * 0.3 + intonation * 0.2)
  const mismatchedWords = findMismatchedWords(expectedWords, spokenWords)
  const errorPhonemes = collectPhonemeHints(mismatchedWords)

  const hints: DiagnosticInput['hints'] = []
  if (accuracy < 70) {
    hints.push({
      dimension: 'pronunciation',
      detail: '原文匹配度偏低，存在较多读错或漏读。',
      suggestion: '先慢速跟读，再逐步提速，重点盯住高频误读词。',
    })
  }
  if (fluency < 70) {
    hints.push({
      dimension: 'fluency',
      detail: '停顿或语速波动较大，流畅度受影响。',
      suggestion: '用意群切分法先读顺，再进入正式录音。',
    })
  }
  if (intonation < 70) {
    hints.push({
      dimension: 'pronunciation',
      detail: '语调变化不足，重读信息不够突出。',
      suggestion: '每句只保留 1-2 个重读词，功能词弱读。',
    })
  }

  const score: PronunciationScore = {
    accuracy,
    fluency,
    intonation,
    overall,
    details: {
      wordsTotal: expectedWords.length,
      wordsCorrect: Math.round(expectedWords.length * overlap),
      wordsPerMinute,
      pauseCount: Math.max(0, Math.round((args.durationSeconds - spokenWords.length / 2.1) / 2)),
      avgConfidence: clamp(Math.round(overlap * 100 - 6), 40, 98),
      mismatchedWords,
      errorPhonemes,
    },
  }

  return {
    part: 'A',
    score,
    transcript: args.transcript,
    diagnosticReport: buildDiagnostic({
      part: 'A',
      score: overall,
      hints,
    }),
    duration: args.durationSeconds,
  }
}

function grammarIssuesForQuestion(text: string): string[] {
  const trimmed = normalizeText(text)
  const issues: string[] = []
  if (!trimmed) {
    issues.push('未作答')
    return issues
  }
  const startsWithQuestionWord = /^(what|where|when|why|how|who|which|can|could|do|does|did|is|are|will|would|should)\b/.test(
    trimmed
  )
  if (!startsWithQuestionWord) {
    issues.push('疑问句开头不规范')
  }
  if (trimmed.split(' ').length < 4) {
    issues.push('句子过短，信息不足')
  }
  return issues
}

export function scorePartB(args: {
  scenario: PartBScenario
  askResponses: string[]
  answerResponses: string[]
  durationSeconds: number
}): PartResult {
  const questionChecks = args.scenario.questionsToAsk.map((question, idx) => {
    const recognized = args.askResponses[idx] ?? ''
    const issues = grammarIssuesForQuestion(recognized)
    return {
      prompt: question.chinesePrompt,
      recognized,
      grammarIssues: issues,
      keywordMatch: keywordMatchPercentage(question.keywords, recognized),
    }
  })

  const answerChecks = args.scenario.questionsToAnswer.map((question, idx) => {
    const recognized = args.answerResponses[idx] ?? ''
    return {
      question: question.englishQuestion,
      recognized,
      keywordMatch: keywordMatchPercentage(question.keywords, recognized),
    }
  })

  const avgGrammarIssue = questionChecks.reduce((sum, item) => sum + item.grammarIssues.length, 0) / questionChecks.length
  const questionGrammar = Math.round(clamp(95 - avgGrammarIssue * 18))
  const questionRelevance = Math.round(
    questionChecks.reduce((sum, item) => sum + item.keywordMatch, 0) / questionChecks.length
  )
  const answerAccuracy = Math.round(
    answerChecks.reduce((sum, item) => sum + item.keywordMatch, 0) / answerChecks.length
  )

  const mergedSpeech = [...args.askResponses, ...args.answerResponses].join(' ')
  const wordsPerMinute = estimateWordsPerMinute(mergedSpeech, args.durationSeconds)
  const answerFluency = Math.round(clamp(90 - Math.abs(wordsPerMinute - 118) * 0.32))

  const overall = Math.round(
    questionGrammar * 0.28 + questionRelevance * 0.26 + answerAccuracy * 0.28 + answerFluency * 0.18
  )

  const hints: DiagnosticInput['hints'] = []
  if (questionGrammar < 70) {
    hints.push({
      dimension: 'grammar',
      detail: '提问句型不稳定，疑问句语序存在偏误。',
      suggestion: '先套用固定疑问句模板，再替换关键词。',
    })
  }
  if (questionRelevance < 70 || answerAccuracy < 70) {
    hints.push({
      dimension: 'content',
      detail: '关键词覆盖不足，存在答非所问风险。',
      suggestion: '先说结论词，再补充细节词，保证命中题干关键词。',
    })
  }
  if (answerFluency < 70) {
    hints.push({
      dimension: 'fluency',
      detail: '回答节奏不稳定，停顿时间偏长。',
      suggestion: '准备 2-3 句填充表达，在思考时保持输出不断线。',
    })
  }

  const score: RolePlayScore = {
    questionGrammar,
    questionRelevance,
    answerAccuracy,
    answerFluency,
    overall,
    details: {
      questions: questionChecks,
      answers: answerChecks,
    },
  }

  return {
    part: 'B',
    score,
    transcript: mergedSpeech,
    diagnosticReport: buildDiagnostic({
      part: 'B',
      score: overall,
      hints,
    }),
    duration: args.durationSeconds,
  }
}

function keyPointCovered(keyPoint: string, transcript: string): boolean {
  const pointTokens = tokenize(keyPoint)
  const transcriptTokens = tokenize(transcript)
  return wordOverlapRatio(pointTokens, transcriptTokens) >= 0.35
}

export function scorePartC(args: {
  story: PartCStory
  transcript: string
  durationSeconds: number
}): PartResult {
  const coveredPoints = args.story.keyPoints.filter((point) => keyPointCovered(point, args.transcript))
  const missedPoints = args.story.keyPoints.filter((point) => !coveredPoints.includes(point))

  const contentCoverage = Math.round((coveredPoints.length / args.story.keyPoints.length) * 100)

  const connectors = ['first', 'then', 'after', 'finally', 'because', 'however', 'so', 'therefore']
  const connectorScore = keywordMatchPercentage(connectors, args.transcript)
  const coherence = Math.round(clamp(58 + connectorScore * 0.42))

  const transcriptTokens = tokenize(args.transcript)
  const uniqueRatio = transcriptTokens.length === 0 ? 0 : new Set(transcriptTokens).size / transcriptTokens.length
  const languageUse = Math.round(clamp(52 + uniqueRatio * 72))

  const wordsPerMinute = estimateWordsPerMinute(args.transcript, args.durationSeconds)
  const fluency = Math.round(clamp(90 - Math.abs(wordsPerMinute - 112) * 0.34))

  const overall = Math.round(
    contentCoverage * 0.4 + coherence * 0.22 + languageUse * 0.2 + fluency * 0.18
  )

  const hints: DiagnosticInput['hints'] = []
  if (contentCoverage < 70) {
    hints.push({
      dimension: 'content',
      detail: '关键点覆盖不够，复述信息有遗漏。',
      suggestion: '准备阶段先抓“人物-事件-结果”三个骨架词。',
    })
  }
  if (coherence < 70) {
    hints.push({
      dimension: 'grammar',
      detail: '连接词使用不足，叙述逻辑不够清晰。',
      suggestion: '强制使用 At first / Then / Finally 等转场词。',
    })
  }
  if (languageUse < 70) {
    hints.push({
      dimension: 'vocabulary',
      detail: '表达重复度较高，词汇变化不够。',
      suggestion: '准备 3 组同义替换词，复述时主动替换。',
    })
  }

  const score: StoryRetellScore = {
    contentCoverage,
    coherence,
    languageUse,
    fluency,
    overall,
    details: {
      keyPointsTotal: args.story.keyPoints.length,
      keyPointsCovered: coveredPoints.length,
      coveredPoints,
      missedPoints,
      wordsPerMinute,
    },
  }

  return {
    part: 'C',
    score,
    transcript: args.transcript,
    diagnosticReport: buildDiagnostic({
      part: 'C',
      score: overall,
      hints,
    }),
    duration: args.durationSeconds,
  }
}

