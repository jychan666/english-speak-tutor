export interface PartAPassage {
  id: string
  type: 'partA'
  title: string
  passage: string
  wordCount: number
  difficulty: 1 | 2 | 3
  topic: string
  focusPhonemes: string[]
  relatedLearnArticles: string[]
}

export interface QuestionToAsk {
  id: string
  chinesePrompt: string
  englishReference: string
  keywords: string[]
}

export interface QuestionToAnswer {
  id: string
  englishQuestion: string
  referenceAnswer: string
  keywords: string[]
}

export interface PartBScenario {
  id: string
  type: 'partB'
  scenario: string
  role: string
  questionsToAsk: QuestionToAsk[]
  questionsToAnswer: QuestionToAnswer[]
  grammarFocus: string[]
  relatedLearnArticles: string[]
}

export interface PartCStory {
  id: string
  type: 'partC'
  title: string
  storyText: string
  keyPoints: string[]
  wordCount: number
  difficulty: 1 | 2 | 3
  frameworkHint: string
  relatedLearnArticles: string[]
}

export interface MockExam {
  id: string
  title: string
  partA: PartAPassage
  partB: PartBScenario
  partC: PartCStory
}

export type ExamContent = PartAPassage | PartBScenario | PartCStory
