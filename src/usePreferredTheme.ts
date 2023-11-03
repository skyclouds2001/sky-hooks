import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useMediaQuery from './useMediaQuery'

const usePreferredTheme = (): DeepReadonly<Ref<'light' | 'dark'>> => {
  const mediaQuery = useMediaQuery('(prefers-color-scheme: dark)')

  return readonly(ref(mediaQuery.isSupported && mediaQuery.matchMediaQuery.value ? 'dark' : 'light'))
}

export default usePreferredTheme
