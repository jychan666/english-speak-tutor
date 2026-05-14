import { ref } from 'vue'

type SpeechCtor = new () => any

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechCtor
    SpeechRecognition?: SpeechCtor
  }
}

export function useSpeechRecognition() {
  const supported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  const listening = ref(false)
  const transcript = ref('')
  const interimTranscript = ref('')
  const error = ref('')

  let recognition: any = null

  function createInstance() {
    if (!supported) {
      return null
    }
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) {
      return null
    }
    const instance = new Ctor()
    instance.lang = 'en-US'
    instance.continuous = true
    instance.interimResults = true
    instance.maxAlternatives = 1
    return instance
  }

  function start() {
    if (!supported || listening.value) {
      return
    }
    transcript.value = ''
    interimTranscript.value = ''
    error.value = ''
    recognition = createInstance()
    if (!recognition) {
      return
    }
    recognition.onstart = () => {
      listening.value = true
    }
    recognition.onresult = (event: any) => {
      let finalText = ''
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }
      if (finalText) {
        transcript.value = `${transcript.value} ${finalText}`.trim()
      }
      interimTranscript.value = interimText.trim()
    }
    recognition.onerror = (event: any) => {
      error.value = event.error
      listening.value = false
    }
    recognition.onend = () => {
      listening.value = false
    }
    recognition.start()
  }

  function stop() {
    if (recognition && listening.value) {
      recognition.stop()
    }
  }

  return {
    supported,
    listening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
  }
}
