import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

/**
 * reactive document ready state
 * @returns document ready state
 */
const useDocumentReadyState = (): Readonly<Ref<DocumentReadyState>> => {
  const readyState = ref(document.readyState)

  useEventListener(document, 'readystatechange', () => {
    readyState.value = document.readyState
  })

  return readonly(readyState)
}

export default useDocumentReadyState
