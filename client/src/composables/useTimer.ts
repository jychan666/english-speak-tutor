import { computed, onUnmounted, ref } from 'vue'

export function useTimer() {
  const elapsedSeconds = ref(0)
  const isRunning = ref(false)
  const durationSeconds = ref<number | null>(null)

  let intervalId: ReturnType<typeof setInterval> | null = null

  const remainingSeconds = computed(() => {
    if (durationSeconds.value === null) {
      return 0
    }
    return Math.max(durationSeconds.value - elapsedSeconds.value, 0)
  })

  function clearTimer() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function stop() {
    isRunning.value = false
    clearTimer()
  }

  function tick() {
    elapsedSeconds.value += 1

    if (durationSeconds.value !== null && elapsedSeconds.value >= durationSeconds.value) {
      elapsedSeconds.value = durationSeconds.value
      stop()
    }
  }

  function start() {
    if (isRunning.value || intervalId) {
      return
    }
    isRunning.value = true
    intervalId = setInterval(tick, 1000)
  }

  function reset() {
    stop()
    elapsedSeconds.value = 0
  }

  function setDuration(seconds: number) {
    const normalized = Math.max(0, Math.floor(seconds))
    durationSeconds.value = normalized
    if (elapsedSeconds.value > normalized) {
      elapsedSeconds.value = normalized
    }
    if (normalized === 0) {
      stop()
    }
  }

  onUnmounted(() => {
    clearTimer()
  })

  return {
    elapsedSeconds,
    remainingSeconds,
    isRunning,
    start,
    stop,
    reset,
    setDuration,
  }
}

