import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

const usePreferredLanguages = (): DeepReadonly<Ref<readonly string[]>> => {
  const languages = ref(navigator.languages)

  useEventListener(
    window,
    'languagechange',
    () => {
      languages.value = navigator.languages
    },
    {
      passive: true,
    }
  )

  return readonly(languages)
}

export default usePreferredLanguages
