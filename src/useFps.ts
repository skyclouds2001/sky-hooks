import { ref, type Ref } from 'vue'
import useAnimationFrame from './useAnimationFrame'

interface UseFpsOptions {
  /**
   * every exec time
   * @default 10
   */
  every?: number
}

/**
 * reactive fps
 * @param options @see {@link UseFpsOptions}
 * @returns fps
 */
const useFps = (options: UseFpsOptions = {}): Ref<number> => {
  const { every = 10 } = options

  const fps = ref(0)

  let now = window.performance.now()
  let tick = 0

  useAnimationFrame(() => {
    ++tick
    if (tick >= every) {
      tick = 0
      const cur = window.performance.now()
      fps.value = Math.round(1000 / (cur - now) / every)
      now = cur
    }
  })

  return fps
}

export default useFps
