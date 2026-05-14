import { onUnmounted, ref } from 'vue'

export interface SpeechOptions {
  rate?: number
  pitch?: number
  lang?: string
  volume?: number
}

export function useSpeechSynthesis() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window
  const speaking = ref(false)
  const paused = ref(false)

  let currentUtterance: SpeechSynthesisUtterance | null = null

  function stop() {
    if (!supported) {
      return
    }
    window.speechSynthesis.cancel()
    currentUtterance = null
    speaking.value = false
    paused.value = false
  }

  function pause() {
    if (!supported) {
      return
    }
    window.speechSynthesis.pause()
    paused.value = true
  }

  function resume() {
    if (!supported) {
      return
    }
    window.speechSynthesis.resume()
    paused.value = false
  }

  function speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (!supported) {
      return Promise.reject(new Error('当前浏览器不支持语音合成'))
    }

    const content = text.trim()
    if (!content) {
      return Promise.resolve()
    }

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
      }
      utterance.onpause = () => {
        paused.value = true
      }
      utterance.onresume = () => {
        paused.value = false
      }
      utterance.onend = () => {
        speaking.value = false
        paused.value = false
        currentUtterance = null
        resolve()
      }
      utterance.onerror = () => {
        speaking.value = false
        paused.value = false
        currentUtterance = null
        reject(new Error('语音播放失败'))
      }

      currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
    })
  }

  onUnmounted(() => {
    stop()
  })

  return {
    supported,
    speaking,
    paused,
    speak,
    stop,
    pause,
    resume,
  }
}

