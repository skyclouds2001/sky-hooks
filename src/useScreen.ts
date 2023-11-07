import { reactive, readonly, type DeepReadonly } from 'vue'
import useEventListener from './useEventListener'

interface UseScreenReturn {
  /**
   * screen information
   */
  screen: DeepReadonly<Pick<Screen, 'availHeight' | 'availWidth' | 'width' | 'height' | 'colorDepth' | 'pixelDepth' | 'isExtended'>>
}

/**
 * reactive screen information
 * @returns @see {@link UseScreenReturn}
 */
const useScreen = (): UseScreenReturn => {
  const screen = reactive({
    width: 0,
    height: 0,
    availWidth: 0,
    availHeight: 0,
    colorDepth: 0,
    pixelDepth: 0,
    isExtended: false,
  })

  const update = (): void => {
    screen.width = window.screen.width
    screen.height = window.screen.height
    screen.availWidth = window.screen.availWidth
    screen.availHeight = window.screen.availHeight
    screen.colorDepth = window.screen.colorDepth
    screen.pixelDepth = window.screen.pixelDepth
    screen.isExtended = window.screen.isExtended
  }

  update()

  useEventListener(window.screen, 'change', update)

  return {
    screen: readonly(screen),
  }
}

export default useScreen
