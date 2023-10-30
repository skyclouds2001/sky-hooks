import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

interface UseWindowScrollReturn {
  /**
   * scroll x position
   */
  x: Readonly<Ref<number>>

  /**
   * scroll y position
   */
  y: Readonly<Ref<number>>
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
