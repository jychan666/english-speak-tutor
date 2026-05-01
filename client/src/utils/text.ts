export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2019']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text)
  if (!normalized) {
    return []
  }
  return normalized.split(' ').filter(Boolean)
}

export function wordOverlapRatio(source: string[], target: string[]): number {
  if (source.length === 0 || target.length === 0) {
    return 0
  }

  const sourceCounts = new Map<string, number>()
  for (const word of source) {
    sourceCounts.set(word, (sourceCounts.get(word) ?? 0) + 1)
  }

  let matched = 0
  for (const word of target) {
    const left = sourceCounts.get(word) ?? 0
    if (left > 0) {
      matched += 1
      sourceCounts.set(word, left - 1)
    }
  }

  return matched / source.length
}

export function keywordMatchPercentage(keywords: string[], text: string): number {
  if (keywords.length === 0) {
    return 0
  }
  const normalized = normalizeText(text)
  let hit = 0
  for (const keyword of keywords) {
    if (normalized.includes(normalizeText(keyword))) {
      hit += 1
    }
  }
  return Math.round((hit / keywords.length) * 100)
}

export function estimateWordsPerMinute(text: string, durationSeconds: number): number {
  const words = tokenize(text).length
  const minutes = Math.max(durationSeconds, 10) / 60
  return Math.round(words / minutes)
}

