import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseWindowSizeReturn {
  /**
   * window width
   */
  width: DeepReadonly<Ref<number>>

  /**
   * window height
   */
  height: DeepReadonly<Ref<number>>
}

/**
 * reactive window size
 * @returns @see {@link UseWindowSizeReturn}
 */
const useWindowSize = (): UseWindowSizeReturn => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  useEventListener(window, 'resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  })

  return {
    width: readonly(width),
    height: readonly(height),
  }
}

export default useWindowSize
