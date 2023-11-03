import { ref, watch, type Ref } from 'vue'
import useMutationObserver from './useMutationObserver'

const useTitle = (initial?: string): Ref<string> => {
  const title = ref<string>(initial ?? '')

  watch(
    title,
    (current, previous) => {
      if (current !== previous) {
        document.title = current
      }
    },
    {
      immediate: true,
    }
  )

  useMutationObserver(
    document.head.querySelector('title') as HTMLTitleElement,
    () => {
      if (document.title !== title.value) {
        title.value = document.title
      }
    },
    {
      childList: true,
    }
  )

  return title
}

export default useTitle
