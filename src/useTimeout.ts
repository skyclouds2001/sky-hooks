import { readonly, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { tryOnScopeDispose } from '.'

interface UseTimeoutOptions {
  /**
   * whether immediate start exec the idle callback
   */
  immediate?: boolean
}

interface UseTimeoutReturn {
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
 * reactive timeout
 * @param fn callback
 * @param timeout timeout, will pass to `setTimeout()`
 * @param options @see {@link UseTimeoutOptions}
 * @returns @see {@link UseTimeoutReturn}
 */
const useTimeout = (fn: () => void, timeout: MaybeRefOrGetter<number>, options: UseTimeoutOptions = {}): UseTimeoutReturn => {
  const { immediate = true } = options

  const isActive = ref(false)

  let id: number | null = null

  const resume = (): void => {
    if (id !== null) {
      window.clearTimeout(id)
      id = null
    }

    if (toValue(timeout) >= 0) {
      isActive.value = true
      id = window.setTimeout(() => {
        isActive.value = false
        id = null
        fn()
      }, toValue(timeout))
    }
  }

  const pause = (): void => {
    if (id !== null) {
      isActive.value = false
      window.clearTimeout(id)
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

export default useTimeout
