import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import tryOnScopeDispose from './tryOnScopeDispose'

interface UseAnimationFrameOptions {
  /**
   * whether immediate start exec the callback
   * @default true
   */
  immediate?: boolean
}

interface UseAnimationFrameReturn {
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
 * reactive animation frame
 * @param fn callback
 * @param options @see {@link UseAnimationFrameOptions}
 * @returns @see {@link UseAnimationFrameReturn}
 */
const useAnimationFrame = (fn: (time: DOMHighResTimeStamp) => void, options: UseAnimationFrameOptions = {}): UseAnimationFrameReturn => {
  const { immediate = true } = options

  const isActive = ref(false)

  let id: number | null = null

  const loop = (time: number): void => {
    fn(time)
    id = window.requestAnimationFrame(loop)
  }

  const resume = (): void => {
    if (id !== null) {
      window.cancelAnimationFrame(id)
      id = null
    }

    isActive.value = true
    id = window.requestAnimationFrame(loop)
  }

  const pause = (): void => {
    if (id !== null) {
      isActive.value = false
      window.cancelAnimationFrame(id)
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

export default useAnimationFrame
