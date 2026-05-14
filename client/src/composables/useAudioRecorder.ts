import { computed, onUnmounted, ref } from 'vue'

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    return ''
  }
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus'
  }
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return 'audio/webm'
  }
  return ''
}

export function useAudioRecorder() {
  const supported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'

  const recording = ref(false)
  const recordedBlob = ref<Blob | null>(null)
  const error = ref('')
  const audioUrlRef = ref<string | null>(null)
  const audioUrl = computed(() => audioUrlRef.value)

  let mediaRecorder: MediaRecorder | null = null
  let mediaStream: MediaStream | null = null
  let chunks: BlobPart[] = []

  function revokeAudioUrl() {
    if (audioUrlRef.value) {
      URL.revokeObjectURL(audioUrlRef.value)
      audioUrlRef.value = null
    }
  }

  function stopTracks() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
      mediaStream = null
    }
  }

  function updateAudioUrl(blob: Blob | null) {
    revokeAudioUrl()
    if (blob) {
      audioUrlRef.value = URL.createObjectURL(blob)
    }
  }

  async function startInternal() {
    if (!supported || recording.value) {
      return
    }

    error.value = ''
    recordedBlob.value = null
    updateAudioUrl(null)

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedMimeType()
      const options = mimeType ? { mimeType } : undefined
      mediaRecorder = new MediaRecorder(mediaStream, options)

      chunks = []
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      mediaRecorder.onerror = () => {
        error.value = '录音失败，请重试。'
        recording.value = false
        stopTracks()
      }
      mediaRecorder.onstop = () => {
        const type = mimeType || 'audio/webm'
        const blob = new Blob(chunks, { type })
        recordedBlob.value = blob
        updateAudioUrl(blob)
        recording.value = false
        stopTracks()
      }

      mediaRecorder.start()
      recording.value = true
    } catch (err: unknown) {
      const domErr = err as { name?: string }
      if (domErr?.name === 'NotAllowedError' || domErr?.name === 'PermissionDeniedError') {
        error.value = '麦克风权限被拒绝，请在浏览器设置中允许访问后重试。'
      } else {
        error.value = '无法启动录音，请检查麦克风设备是否可用。'
      }
      recording.value = false
      stopTracks()
    }
  }

  function start() {
    void startInternal()
  }

  function stop() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      return
    }
    mediaRecorder.stop()
  }

  function reset() {
    stop()
    recordedBlob.value = null
    updateAudioUrl(null)
    error.value = ''
  }

  onUnmounted(() => {
    stop()
    stopTracks()
    revokeAudioUrl()
  })

  return {
    supported,
    recording,
    recordedBlob,
    audioUrl,
    error,
    start,
    stop,
    reset,
  }
}

