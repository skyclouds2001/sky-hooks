import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseWindowScrollReturn {
  /**
   * scroll x position
   */
  x: DeepReadonly<Ref<number>>

  /**
   * scroll y position
   */
  y: DeepReadonly<Ref<number>>
}

/**
 * reactive window scroll position
 * @returns @see {@link UseWindowScrollReturn}
 */
const useWindowScroll = (): UseWindowScrollReturn => {
  const x = ref(window.scrollX)
  const y = ref(window.scrollY)

  useEventListener(window, 'scroll', () => {
    x.value = window.scrollX
    y.value = window.scrollY
  })

  return {
    x: readonly(x),
    y: readonly(y),
  }
}

export default useWindowScroll
