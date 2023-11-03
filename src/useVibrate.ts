import { ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

interface UseVibrateReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * vibrate pattern
   */
  pattern: Ref<VibratePattern>

  /**
   * start vibrate
   */
  vibrate: () => void

  /**
   * stop vibrate
   */
  stop: () => void
}

/**
 * reactive Vibration API
 * @param initial initial value of vibrate pattern
 * @returns @see {@link UseVibrateReturn}
 */
const useVibrate = (initial: MaybeRefOrGetter<VibratePattern> = 0): UseVibrateReturn => {
  const isSupported = 'vibrate' in navigator

  const pattern = ref(toValue(initial))

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
