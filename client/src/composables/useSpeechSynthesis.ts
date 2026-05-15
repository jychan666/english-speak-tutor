import { onUnmounted, ref, computed } from 'vue'

export interface SpeechOptions {
  rate?: number
  pitch?: number
  lang?: string
  volume?: number
}

function estimateWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function useSpeechSynthesis() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window
  const speaking = ref(false)
  const paused = ref(false)
  const progress = ref(0)
  const duration = ref(0)

  let currentUtterance: SpeechSynthesisUtterance | null = null
  let progressTimer: ReturnType<typeof setInterval> | null = null

  function clearProgressTimer() {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }

  function startProgressTracking(text: string, rate: number) {
    clearProgressTimer()
    progress.value = 0
    const wordCount = estimateWordCount(text)
    const estimatedDurationMs = (wordCount / (rate * 2.5)) * 1000
    duration.value = Math.max(estimatedDurationMs, 1000)
    const tickInterval = 80
    let elapsed = 0
    progressTimer = setInterval(() => {
      if (paused.value) return
      elapsed += tickInterval
      progress.value = Math.min(Math.round((elapsed / duration.value) * 100), 95)
    }, tickInterval)
  }

  function stop() {
    if (!supported) return
    window.speechSynthesis.cancel()
    currentUtterance = null
    speaking.value = false
    paused.value = false
    progress.value = 0
    clearProgressTimer()
  }

  function pause() {
    if (!supported) return
    window.speechSynthesis.pause()
    paused.value = true
  }

  function resume() {
    if (!supported) return
    window.speechSynthesis.resume()
    paused.value = false
  }

  function speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (!supported) {
      return Promise.reject(new Error('当前浏览器不支持语音合成'))
    }

    const content = text.trim()
    if (!content) return Promise.resolve()

    stop()

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = options.lang ?? 'en-US'
      utterance.rate = options.rate ?? 1
      utterance.pitch = options.pitch ?? 1
      utterance.volume = options.volume ?? 1

      utterance.onstart = () => {
        speaking.value = true
        paused.value = false
        startProgressTracking(content, utterance.rate)
      }
      utterance.onpause = () => { paused.value = true }
      utterance.onresume = () => { paused.value = false }
      utterance.onend = () => {
        speaking.value = false
        paused.value = false
        progress.value = 100
        duration.value = 0
        currentUtterance = null
        clearProgressTimer()
        resolve()
      }
      utterance.onerror = () => {
        speaking.value = false
        paused.value = false
        progress.value = 0
        duration.value = 0
        currentUtterance = null
        clearProgressTimer()
        reject(new Error('语音播放失败'))
      }

      currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
    })
  }

  const durationSeconds = computed(() => Math.round(duration.value / 1000))

  onUnmounted(() => {
    clearProgressTimer()
    stop()
  })

  return {
    supported,
    speaking,
    paused,
    progress,
    duration,
    durationSeconds,
    speak,
    stop,
    pause,
    resume,
  }
}

