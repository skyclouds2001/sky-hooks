import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

/**
 * reactive preferred languages
 * @returns language information
 */
const usePreferredLanguages = (): DeepReadonly<Ref<string[]>> => {
  const languages = ref(navigator.languages)

  useEventListener(window, 'languagechange', () => {
    languages.value = navigator.languages
  })

  return readonly(languages)
}

export default usePreferredLanguages
