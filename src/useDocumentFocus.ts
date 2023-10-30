import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

/**
 * reactive document focus state
 * @returns whether document is focus
 */
const useDocumentFocus = (): Readonly<Ref<boolean>> => {
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
