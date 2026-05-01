import type { LearnCategory, LearnCategoryInfo } from '@/types/learning'

export type LearnCategoryMeta = Omit<LearnCategoryInfo, 'count'>

export const learnCategoryMeta: LearnCategoryMeta[] = [
  {
    id: 'quick-crash',
    name: '考前速成',
    icon: '🎯',
    description: '考前 15 分钟抓关键动作，少走弯路。',
  },
  {
    id: 'pronunciation',
    name: '发音突破',
    icon: '🗣',
    description: '纠正常见发音偏误，听得懂也说得准。',
  },
  {
    id: 'grammar',
    name: '语法急救',
    icon: '📝',
    description: '只学考试高频句型，快速避免低级错误。',
  },
  {
    id: 'templates',
    name: '模板工具箱',
    icon: '🏗',
    description: '角色扮演和复述高频模板，一套就能上场。',
  },
  {
    id: 'vocabulary',
    name: '场景词汇包',
    icon: '📖',
    description: '按场景记词，开口时不再卡词。',
  },
  {
    id: 'tips',
    name: '实战技巧',
    icon: '🎬',
    description: '临场应对策略，卡壳也能稳住节奏。',
  },
]

export function withCategoryCounts(
  counts: Record<LearnCategory, number>
): LearnCategoryInfo[] {
  return learnCategoryMeta.map((category) => ({
    ...category,
    count: counts[category.id] ?? 0,
  }))
}

