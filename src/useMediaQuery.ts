import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

const useMediaQuery = (
  query: string
): {
  isSupported: boolean
  matchMediaQuery: DeepReadonly<Ref<boolean>>
} => {
  const isSupported = 'matchMedia' in window && typeof window.matchMedia === 'function'

  const mediaQuery = window.matchMedia(query)

  const matches = ref(mediaQuery.matches)

  useEventListener(
    mediaQuery,
    'change',
    (e) => {
      matches.value = (e as MediaQueryListEvent).matches
    },
    {
      passive: true,
    }
  )

  return {
    isSupported,
    matchMediaQuery: readonly(matches),
  }
}

export default useMediaQuery
