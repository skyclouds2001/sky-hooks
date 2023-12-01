import { ref, shallowRef, watch, type Ref, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'
import { type StorageDataType, parse, stringify } from './serialize'

interface UseStorageOptions<T> {
  /**
   * storage type, can be `window.sessionStorage` or `window.localStorage`
   * @default window.localStorage
   */
  storage?: Storage

  /**
   * whether use storage key prefix, by default use `'sky-hooks'` as the prefix
   * @default true
   */
  prefix?: boolean | string

  /**
   * whether use shallowRef for wrap data, which may bring performance advantage
   * @default false
   */
  shallow?: boolean

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

/**
 * reactive Web Storage API
 * @param key storage key
 * @param options @see {@link UseStorageOptions}
 * @returns storage data of specific key
 */
const useStorage = <T extends StorageDataType>(key: string, options: UseStorageOptions<T> = {}): Ref<T | null> | ShallowRef<T | null> => {
  const { storage = window.localStorage, prefix = true, shallow = false, deep = true, initial } = options

  const storageKey = prefix === false ? key : `${typeof prefix === 'string' ? prefix : 'sky-hooks'}-${key}`

  const storeValue = storage.getItem(storageKey)

  const data = (shallow ? shallowRef : ref)(storeValue !== null ? parse<T>(storeValue) : null) as Ref<T | null>

  watch(
    data,
    (value) => {
      if (value === null) {
        storage.removeItem(storageKey)
      } else {
        storage.setItem(storageKey, stringify<T>(value))
      }
    },
    {
      deep,
      immediate: true,
    }
  )

  if (initial !== undefined && data.value === null) {
    data.value = initial
  }

  useEventListener(window, 'storage', (e) => {
    if (e.key === storageKey) {
      data.value = e.newValue !== null ? parse<T>(e.newValue) : null
    }
  })

  return data
}

export default useStorage
