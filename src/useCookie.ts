import { type Ref, ref, watch } from 'vue'
import useEventListener from './useEventListener'
import { type StorageDataType, stringify, parse } from './serialize'

interface UseCookieOptions<T> {
  /**
   * storage type
   * @default true
   */
  deep?: boolean

  /**
   * initial value of storage data
   */
  initial?: T
}

interface UseCookieReturn<T> {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * cookie data
   */
  data: Ref<T | null>
}

/**
 * reactive Cookie Store API
 * @param name storage key
 * @param options @see {@link UseCookieOptions}
 * @returns @see {@link UseCookieReturn}
 */
const useCookie = <T extends StorageDataType>(name: string, options: UseCookieOptions<T> = {}): UseCookieReturn<T> => {
  const { deep = true, initial } = options

  const isSupported = 'cookieStore' in window

  const data = ref(initial ?? null) as Ref<T | null>

  if (isSupported) {
    void window.cookieStore.get(name).then((cookie): void => {
      if (cookie != null) {
        data.value = parse<T>(cookie.value)
      }
    })

    watch(
      data,
      (value) => {
        if (value == null) {
          void window.cookieStore.delete(name)
        } else {
          void window.cookieStore.set(name, stringify<T>(value))
        }
      },
      {
        deep,
        immediate: true,
      }
    )

    useEventListener(window.cookieStore, 'change', (e) => {
      const { changed, deleted } = e as CookieChangeEvent

      if (changed.some((v) => v.name === name)) {
        void window.cookieStore.set(name, (changed.find((v) => v.name === name) as CookieListItem).value)
      }
      if (deleted.some((v) => v.name === name)) {
        void window.cookieStore.delete(name)
      }
    })
  }

  return {
    isSupported,
    data,
  }
}

export default useCookie
