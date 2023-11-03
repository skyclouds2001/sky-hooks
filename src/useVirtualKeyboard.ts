import { readonly, ref, watch, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseVirtualKeyboardReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * virtual keyboard visibility status
   */
  visible: Ref<boolean>

  /**
   * virtual keyboard controls
   */
  controls: Ref<boolean>

  /**
   * virtual keyboard dom rect
   */
  rect: DeepReadonly<Ref<DOMRect>>

  /**
   * hide virtual keyboard
   */
  hide: () => void

  /**
   * show virtual keyboard
   */
  show: () => void
}

/**
 * reactive VirtualKeyboard API
 * @returns @see {@link UseVirtualKeyboardReturn}
 */
const useVirtualKeyboard = (): UseVirtualKeyboardReturn => {
  const isSupported = 'virtualKeyboard' in navigator

  const visible = ref(false)

  const controls = ref(true)

  const rect = ref(navigator.virtualKeyboard.boundingRect)

  const hide = (): void => {
    if (!isSupported) return

    navigator.virtualKeyboard.hide()
  }

  const show = (): void => {
    if (!isSupported) return

    navigator.virtualKeyboard.show()
  }

  if (isSupported) {
    navigator.virtualKeyboard.overlaysContent = controls.value

    watch(visible, (visible) => {
      visible ? show() : hide()
    })

    watch(controls, (controls) => {
      navigator.virtualKeyboard.overlaysContent = controls
    })

    useEventListener(navigator.virtualKeyboard, 'geometrychange', () => {
      visible.value = Object.entries(navigator.virtualKeyboard.boundingRect).some(([, v]) => v !== 0)

      rect.value = navigator.virtualKeyboard.boundingRect
    })
  }

  return {
    isSupported,
    visible,
    controls,
    rect: readonly(rect),
    hide,
    show,
  }
}

export default useVirtualKeyboard
