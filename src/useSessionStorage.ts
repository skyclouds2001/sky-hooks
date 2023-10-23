import { type ShallowRef, type Ref, type UnwrapRef } from 'vue'
import { useStorage } from '.'

interface UseSessionStorageOptions<T> {
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
 * reactive Web Storage API for sessionStorage
 * @param key storage key
 * @param options @see {@link UseSessionStorageOptions}
 * @returns storage data of specific key
 */
const useSessionStorage = <T extends number | string | boolean | object | null>(key: string, options: UseSessionStorageOptions<T> = {}): Ref<UnwrapRef<T> | null> | ShallowRef<T | null> => {
  return useStorage<T>(key, { ...options, storage: window.sessionStorage })
}

export default useSessionStorage
