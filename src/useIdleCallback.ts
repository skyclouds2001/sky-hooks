import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import tryOnScopeDispose from './tryOnScopeDispose'

interface UseIdleCallbackOptions {
  /**
   * whether immediate start exec the callback
   */
  immediate?: boolean

  /**
   * idle callback timeout, will pass to `window.requestIdleCallback()`
   */
  timeout?: number
}

interface UseIdleCallbackReturn {
  /**
   * current status
   */
  isActive: DeepReadonly<Ref<boolean>>

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
 * reactive Background Tasks API
 * @param fn callback
 * @param options @see {@link UseIdleCallbackOptions}
 * @returns @see {@link UseIdleCallbackReturn}
 */
const useIdleCallback = (fn: (idleDeadline: IdleDeadline) => void, options: UseIdleCallbackOptions = {}): UseIdleCallbackReturn => {
  const { immediate = true } = options

  const isActive = ref(false)

  let id: number | null = null

  const loop = (idleDeadline: IdleDeadline): void => {
    fn(idleDeadline)
    id = window.requestIdleCallback(loop, options)
  }

  const resume = (): void => {
    if (id !== null) {
      window.cancelIdleCallback(id)
      id = null
    }

    isActive.value = true
    id = window.requestIdleCallback(loop, options)
  }

  const pause = (): void => {
    if (id !== null) {
      isActive.value = false
      window.cancelIdleCallback(id)
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

export default useIdleCallback
