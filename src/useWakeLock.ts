import { readonly, ref, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseWakeLockReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * screen wake lock status
   */
  isWakeLock: Readonly<Ref<boolean>>

  /**
   * request screen wake lock
   */
  request: () => Promise<void>

  /**
   * release screen wake lock
   */
  release: () => Promise<void>

  /**
   * toggle screen wake lock
   */
  toggle: () => Promise<void>
}

/**
 * reactive Screen Wake Lock API
 * @returns @see {@link UseWakeLockReturn}
 */
const useWakeLock = (): UseWakeLockReturn => {
  const isSupported = 'wakeLock' in navigator

  const isWakeLock = ref(false)

  let wakeLockSentinel: WakeLockSentinel | null = null

  const request = async (): Promise<void> => {
    if (!isSupported) return

    if (wakeLockSentinel !== null) return

    wakeLockSentinel = await navigator.wakeLock.request()

    isWakeLock.value = !wakeLockSentinel.released
  }

  const release = async (): Promise<void> => {
    if (!isSupported) return

    if (wakeLockSentinel === null) return

    await wakeLockSentinel.release()

    isWakeLock.value = !wakeLockSentinel.released

    wakeLockSentinel = null
  }

  const toggle = async (): Promise<void> => {
    await (isWakeLock.value ? release() : request())
  }

  useEventListener(document, 'visibilitychange', () => {
    if (!isSupported) return

    if (wakeLockSentinel === null) return

    if (document.visibilityState === 'hidden') return

    void navigator.wakeLock.request().then((wakeLock) => {
      isWakeLock.value = !wakeLock.released
    })
  })

  return {
    isSupported,
    isWakeLock: readonly(isWakeLock),
    request,
    release,
    toggle,
  }
}

export default useWakeLock
