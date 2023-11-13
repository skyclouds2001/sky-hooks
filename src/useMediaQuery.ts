import { readonly, ref, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseMediaQueryReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * media query status
   */
  matches: DeepReadonly<Ref<boolean>>
}

/**
 * reactive media query
 * @param query query string
 * @returns @see {@link UseMediaQueryReturn}
 */
const useMediaQuery = (query: MaybeRefOrGetter<string>): UseMediaQueryReturn => {
  const isSupported = 'matchMedia' in window

  const matches = ref(false)

  watch(
    () => toValue(query),
    (query) => {
      const mediaQuery = window.matchMedia(query)

      matches.value = mediaQuery.matches

      useEventListener(mediaQuery, 'change', (e) => {
        matches.value = (e as MediaQueryListEvent).matches
      })
    },
    {
      immediate: true,
    }
  )

  return {
    isSupported,
    matches: readonly(matches),
  }
}

export default useMediaQuery
