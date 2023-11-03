import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

/**
 * reactive document focus state
 * @returns whether document is focus
 */
const useDocumentFocus = (): DeepReadonly<Ref<boolean>> => {
  const isFocus = ref(document.hasFocus())

  useEventListener(window, 'focus', () => {
    isFocus.value = true
  })

  useEventListener(window, 'blur', () => {
    isFocus.value = false
  })

  return readonly(isFocus)
}

export default useDocumentFocus
