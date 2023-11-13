import { ref, shallowRef, watch, type Ref, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'

type StorageDataType = number | string | boolean | object | null | any

type StorageDataTypeEnum = 'number' | 'string' | 'boolean' | 'object' | 'null' | 'map' | 'set' | 'date' | 'any'

const getTypeString = <T extends StorageDataType>(data: T): StorageDataTypeEnum => {
  return data === null ? 'null' : data instanceof Set ? 'set' : data instanceof Map ? 'map' : data instanceof Date ? 'date' : typeof data === 'object' ? 'object' : typeof data === 'string' ? 'string' : typeof data === 'boolean' ? 'boolean' : !Number.isNaN(data) ? 'number' : 'any'
}

const stringify = <T extends StorageDataType>(data: T): string => {
  const type = getTypeString(data)
  let val: string
  switch (type) {
    case 'object':
      val = JSON.stringify(data)
      break
    case 'map':
      val = JSON.stringify(Array.from((data as Map<any, any>).entries()))
      break
    case 'set':
      val = JSON.stringify(Array.from(data as Set<any>))
      break
    case 'date':
      val = (data as Date).toISOString()
      break
    case 'null':
      val = 'null'
      break
    case 'number':
    case 'boolean':
    case 'string':
    case 'any':
    default:
      val = String(data)
      break
  }
  return JSON.stringify({
    data: val,
    type,
  })
}

const parse = <T extends StorageDataType>(data: string): T => {
  const val = JSON.parse(data) as Record<'data' | 'type', string>
  let res: any
  switch (val.type) {
    case 'number':
      res = Number(val.data)
      break
    case 'boolean':
      res = val.data === 'true'
      break
    case 'object':
      res = JSON.parse(val.data)
      break
    case 'map':
      res = new Map(JSON.parse(val.data))
      break
    case 'set':
      res = new Set(JSON.parse(val.data))
      break
    case 'date':
      res = new Date(val.data)
      break
    case 'null':
      res = null
      break
    case 'string':
    case 'any':
    default:
      res = val.data
      break
  }
  return res
}

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
const useStorage = <T extends number | string | boolean | object | null>(key: string, options: UseStorageOptions<T> = {}): Ref<T | null> | ShallowRef<T | null> => {
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
