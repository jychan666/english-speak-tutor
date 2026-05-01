export type LearnCategory =
  | 'quick-crash'
  | 'pronunciation'
  | 'grammar'
  | 'templates'
  | 'vocabulary'
  | 'tips'

export interface LearnSection {
  type: 'text' | 'comparison' | 'tip' | 'example' | 'template' | 'heading'
  title?: string
  body: string
  wrongExample?: string
  rightExample?: string
  note?: string
}

export interface LearnArticle {
  id: string
  category: LearnCategory
  title: string
  subtitle: string
  readTime: 3 | 5 | 8
  level: 'beginner' | 'intermediate'
  content: LearnSection[]
  quickCard: string
  relatedArticleIds: string[]
  relatedPracticeType?: 'A' | 'B' | 'C'
}

export interface LearnCategoryInfo {
  id: LearnCategory
  name: string
  icon: string
  description: string
  count: number
}

export interface SkillProfile {
  pronunciation: number
  fluency: number
  grammar: number
  vocabulary: number
  contentRetention: number
  updatedAt: string
}
