import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseWindowControlsOverlayReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * the title bar visibility
   */
  visible: DeepReadonly<Ref<boolean>>

  /**
   * the size and position of the title bar
   */
  rect: DeepReadonly<Ref<DOMRect>>
}

/**
 * reactive Window Controls Overlay API
 * @returns @see {@link UseWindowControlsOverlayReturn}
 */
const useWindowControlsOverlay = (): UseWindowControlsOverlayReturn => {
  const isSupported = 'windowControlsOverlay' in navigator

  const visible = ref(navigator.windowControlsOverlay.visible)

  const rect = ref(navigator.windowControlsOverlay.getTitlebarAreaRect())

  if (isSupported) {
    useEventListener(navigator.windowControlsOverlay, 'geometrychange', (e) => {
      visible.value = (e as WindowControlsOverlayGeometryChangeEvent).visible
      rect.value = (e as WindowControlsOverlayGeometryChangeEvent).titlebarAreaRect
    })
  }

  return {
    isSupported,
    visible: readonly(visible),
    rect: readonly(rect),
  }
}

export default useWindowControlsOverlay
