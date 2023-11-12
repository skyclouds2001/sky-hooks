import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useMediaQuery from './useMediaQuery'

/**
 * reactive preferred theme
 * @returns theme information
 */
const usePreferredTheme = (): DeepReadonly<Ref<'light' | 'dark'>> => {
  const mediaQuery = useMediaQuery('(prefers-color-scheme: dark)')

  return readonly(ref(mediaQuery.isSupported && mediaQuery.matches.value ? 'dark' : 'light'))
}

export default usePreferredTheme
