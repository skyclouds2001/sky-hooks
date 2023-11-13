import { ref, watch, type Ref } from 'vue'

/**
 * reactive favicon controller
 * @param initial initial value
 * @returns reactive favicon
 */
const useFavicon = (initial?: string): Ref<string> => {
  const favicon = ref(initial ?? '')

  watch(
    favicon,
    (current, previous) => {
      if (current !== previous && typeof current === 'string') {
        document.head.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]').forEach((el) => {
          el.href = current
        })
      }
    },
    {
      immediate: true,
    }
  )

  return favicon
}

export default useFavicon
