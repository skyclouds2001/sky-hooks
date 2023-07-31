import { ref, type Ref } from 'vue'
import useEventListener from './useEventListener'

const useVirtualKeyboard = (): {
  isSupported: boolean
  visible: Ref<boolean>
  rect: Ref<DOMRect>
  hide: () => void
  show: () => void
} => {
  const isSupported = 'virtualKeyboard' in navigator

  const visible = ref(false)

  const rect = ref(navigator.virtualKeyboard.boundingRect)

  const hide = (): void => {
    if (!isSupported) return

    navigator.virtualKeyboard.hide()
    visible.value = false
  }

  const show = (): void => {
    if (!isSupported) return

    navigator.virtualKeyboard.show()
    visible.value = true
  }

  if (isSupported) {
    useEventListener(navigator.virtualKeyboard, 'geometrychange', () => {
      rect.value = navigator.virtualKeyboard.boundingRect
    })
  }

  return {
    isSupported,
    visible,
    rect,
    hide,
    show,
  }
}

export default useVirtualKeyboard
