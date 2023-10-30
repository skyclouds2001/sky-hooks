import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

/**
 * reactive document visibility state
 * @returns document visibility state
 */
const useDocumentVisibility = (): Readonly<Ref<DocumentVisibilityState>> => {
  const visibility = ref(document.visibilityState)

  useEventListener(document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  })

  return readonly(visibility)
}

export default useDocumentVisibility
