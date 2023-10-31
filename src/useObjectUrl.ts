import { type MaybeRefOrGetter, readonly, ref, type Ref, toValue, watch } from 'vue'
import { tryOnScopeDispose } from '.'

/**
 * reactive object url
 * @param source data source
 * @returns transform result
 */
const useObjectURL = (source: MaybeRefOrGetter<File | Blob | MediaSource | null>): Readonly<Ref<string | null>> => {
  const url = ref<string | null>(null)

  const release = (): void => {
    if (url.value !== null) {
      URL.revokeObjectURL(url.value)
      url.value = ''
    }
  }

  watch(
    () => toValue(source),
    (current) => {
      release()

      if (current !== null) {
        url.value = URL.createObjectURL(current)
      }
    },
    {
      immediate: true,
    }
  )

  tryOnScopeDispose(release)

  return readonly(url)
}

export default useObjectURL
