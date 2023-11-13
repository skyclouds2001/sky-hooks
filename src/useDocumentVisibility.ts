import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

/**
 * reactive document visibility state
 * @returns document visibility state
 */
const useDocumentVisibility = (): DeepReadonly<Ref<DocumentVisibilityState>> => {
  const visibility = ref(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  })

  return readonly(visibility)
}

export default useDocumentVisibility
