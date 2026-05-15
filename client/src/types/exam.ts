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
  /** 对话原文 —— 学生先听这段对话（仅播 1 遍），之后进行三问五答 */
  dialogue: string
  /** 计算机对三问的回答 —— 第 3-5 个回答题的答案来源 */
  computerAnswers: string[]
  questionsToAsk: QuestionToAsk[]
  questionsToAnswer: QuestionToAnswer[]
  grammarFocus: string[]
  relatedLearnArticles: string[]
}

export interface PartCStory {
  id: string
  type: 'partC'
  title: string
  /** 中文梗概 —— 听故事前显示在屏幕上，帮学生预测内容 */
  chineseOutline: string
  /** 关键词（英文+中文）—— 与梗概同时显示 */
  keywords: Array<{ en: string; zh: string }>
  /** 故事全文 —— 约 200-280 词，记叙文 */
  storyText: string
  /** 10 个评分信息点 */
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
