export type DiagnosticDimension =
  | 'pronunciation'
  | 'fluency'
  | 'grammar'
  | 'vocabulary'
  | 'content'

const dimensionArticleMap: Record<DiagnosticDimension, string[]> = {
  pronunciation: ['pr-th-sound', 'pr-vw', 'pr-linking'],
  fluency: ['tp-stuck-rescue', 'tp-time-management', 'qa-part-a-30sec'],
  grammar: ['gr-question-order', 'gr-tense-safe', 'gr-connectors'],
  vocabulary: ['vo-campus', 'vo-travel', 'vo-environment'],
  content: ['tm-part-c-opening', 'tm-part-c-transition', 'tp-prep-minute'],
}

const partPracticeMap: Record<'A' | 'B' | 'C', string[]> = {
  A: ['再练一篇 Part A 同难度材料'],
  B: ['重做一组 Part B 限时提问'],
  C: ['再做一篇 Part C 关键词复述'],
}

export function recommendArticlesByDimensions(
  dimensions: DiagnosticDimension[],
  limit = 4
): string[] {
  const list = dimensions.flatMap((dimension) => dimensionArticleMap[dimension] ?? [])
  return Array.from(new Set(list)).slice(0, limit)
}

export function recommendPracticeByPart(part: 'A' | 'B' | 'C'): string[] {
  return partPracticeMap[part] ?? []
}

export function topArticleForDimension(dimension: DiagnosticDimension): string | undefined {
  return dimensionArticleMap[dimension]?.[0]
}

