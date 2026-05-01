import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PartResult, ExamAttempt } from '@/types/scoring'
import type { PartAPassage, PartBScenario, PartCStory, MockExam } from '@/types/exam'

export type ExamMode = 'practice' | 'mock'
export type ExamPart = 'A' | 'B' | 'C'
export type ExamPhase = 'idle' | 'preparing' | 'listening' | 'speaking' | 'scoring' | 'done'

export const useExamStore = defineStore('exam', () => {
  const mode = ref<ExamMode>('practice')
  const currentPart = ref<ExamPart | null>(null)
  const phase = ref<ExamPhase>('idle')
  const transcript = ref('')
  const interimTranscript = ref('')
  const partResults = ref<PartResult[]>([])
  const currentAttempt = ref<ExamAttempt | null>(null)

  const currentPartContent = ref<PartAPassage | PartBScenario | PartCStory | null>(null)
  const mockExam = ref<MockExam | null>(null)

  const isRecording = ref(false)
  const elapsedSeconds = ref(0)

  function setMode(m: ExamMode) {
    mode.value = m
  }

  function setPart(part: ExamPart) {
    currentPart.value = part
    phase.value = 'idle'
    transcript.value = ''
    interimTranscript.value = ''
  }

  function setPhase(p: ExamPhase) {
    phase.value = p
  }

  function setTranscript(text: string) {
    transcript.value = text
  }

  function setInterimTranscript(text: string) {
    interimTranscript.value = text
  }

  function appendTranscript(text: string) {
    transcript.value += ' ' + text
  }

  function addPartResult(result: PartResult) {
    const existing = partResults.value.findIndex((r) => r.part === result.part)
    if (existing >= 0) {
      partResults.value[existing] = result
    } else {
      partResults.value.push(result)
    }
  }

  function resetSession() {
    phase.value = 'idle'
    transcript.value = ''
    interimTranscript.value = ''
    partResults.value = []
    currentAttempt.value = null
    currentPartContent.value = null
    mockExam.value = null
    isRecording.value = false
    elapsedSeconds.value = 0
  }

  const totalScore = computed(() => {
    return partResults.value.reduce((sum, r) => sum + r.score.overall, 0)
  })

  const maxPossibleScore = computed(() => {
    return partResults.value.length * 100
  })

  return {
    mode,
    currentPart,
    phase,
    transcript,
    interimTranscript,
    partResults,
    currentAttempt,
    currentPartContent,
    mockExam,
    isRecording,
    elapsedSeconds,
    totalScore,
    maxPossibleScore,
    setMode,
    setPart,
    setPhase,
    setTranscript,
    setInterimTranscript,
    appendTranscript,
    addPartResult,
    resetSession,
  }
})
