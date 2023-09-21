import { type Ref, ref } from 'vue'

const useVibrate = (
  initial?: VibratePattern
): {
  isSupported: boolean
  pattern: Ref<VibratePattern>
  vibrate: () => void
  stop: () => void
} => {
  const isSupported = 'vibrate' in navigator

  const pattern = ref<VibratePattern>(initial ?? 0)

  const vibrate = (): void => {
    if (!isSupported) return

    navigator.vibrate(pattern.value)
  }

  const stop = (): void => {
    if (!isSupported) return

    navigator.vibrate(0)
  }

  return {
    isSupported,
    pattern,
    vibrate,
    stop,
  }
}

export default useVibrate
