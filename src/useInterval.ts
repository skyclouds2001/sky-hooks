import { type MaybeRefOrGetter, readonly, ref, toValue, type Ref } from 'vue'
import { tryOnScopeDispose } from '.'

interface UseIntervalOptions {
  /**
   * whether immediate start exec the idle callback
   */
  immediate?: boolean
}

interface UseIntervalReturn {
  /**
   * current status
   */
  isActive: Readonly<Ref<boolean>>

  /**
   * resume the callback
   */
  resume: () => void

  /**
   * pause the callback
   */
  pause: () => void
}

/**
 * reactive interval
 * @param fn callback
 * @param timeout timeout, will pass to `setInterval()`
 * @param options @see {@link UseIntervalOptions}
 * @returns @see {@link UseIntervalReturn}
 */
const useInterval = (fn: () => void, timeout: MaybeRefOrGetter<number>, options: UseIntervalOptions = {}): UseIntervalReturn => {
  const { immediate = true } = options

  const isActive = ref(false)

  let id: number | null = null

  const resume = (): void => {
    if (id !== null) {
      window.clearInterval(id)
      id = null
    }

    if (toValue(timeout) >= 0) {
      isActive.value = true
      id = window.setInterval(fn, toValue(timeout))
    }
  }

  const pause = (): void => {
    if (id !== null) {
      isActive.value = false
      window.clearInterval(id)
      id = null
    }
  }

  if (immediate) {
    resume()
  }

  tryOnScopeDispose(pause)

  return {
    isActive: readonly(isActive),
    resume,
    pause,
  }
}

export default useInterval
