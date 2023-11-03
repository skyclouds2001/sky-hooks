import { shallowReadonly, shallowRef, type DeepReadonly, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'

/**
 * reactive document active element
 * @returns document active element
 */
const useDocumentActiveElement = (): DeepReadonly<ShallowRef<Element | null>> => {
  const activeElement = shallowRef(document.activeElement)

  useEventListener(window, 'blur', () => {
    activeElement.value = document.activeElement
  })

  useEventListener(window, 'focus', () => {
    activeElement.value = document.activeElement
  })

  return shallowReadonly(activeElement)
}

export default useDocumentActiveElement
