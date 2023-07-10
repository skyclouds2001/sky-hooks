import { shallowReadonly, shallowRef, type ShallowRef } from 'vue'
import { useEventListener } from '.'

const useDocumentActiveElement = (): Readonly<ShallowRef<Element | null>> => {
  const activeElement = shallowRef(document.activeElement)

  useEventListener(window, 'blur', () => {
    activeElement.value = document.activeElement
  }, { passive: true })

  useEventListener(window, 'focus', () => {
    activeElement.value = document.activeElement
  }, { passive: true })

  return shallowReadonly(activeElement)
}

export default useDocumentActiveElement
