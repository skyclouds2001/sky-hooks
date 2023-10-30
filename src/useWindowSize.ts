import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

interface UseWindowSize {
  /**
   * window width
   */
  width: Readonly<Ref<number>>

  /**
   * window height
   */
  height: Readonly<Ref<number>>
}

/**
 * reactive window size
 * @returns @see {@link UseWindowSize}
 */
const useWindowSize = (): UseWindowSize => {
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
