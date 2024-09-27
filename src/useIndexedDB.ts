import { Ref, ref, shallowReadonly, shallowRef, watch, type ShallowRef } from 'vue'
import { type Obj } from './util'

const INDEXDB_DATABASE_NAME = 'databse'

const INDEXDB_OBJECT_STORE_NAME = 'object-store'

interface UseIndexedDBOptions {
  /**
   * indexdb database name
   */
  database?: string

  /**
   * indexdb object store name
   */
  store?: string

  /**
   * whether do initial when hook is called
   */
  initial?: boolean
}

interface UseIndexedDBReturn<D extends Obj> {
  data: Ref<D | null>

  /**
   * indexdb database
   */
  database: Readonly<ShallowRef<IDBDatabase | null>>

  /**
   * indexdb object store
   */
  store: Readonly<ShallowRef<IDBObjectStore | null>>

  /**
   * init database and store
   */
  create: () => Promise<void>

  /**
   * destroy database and store
   */
  destroy: () => Promise<void>
}

/**
 * reactive IndexedDB API
 * @param options @see {@link UseIndexedDBOptions}
 * @returns @see {@link UseIndexedDBReturn}
 */
const useIndexedDB = <const D extends Obj = Obj>(index: number | string, options: UseIndexedDBOptions = {}): UseIndexedDBReturn<D> => {
  const database = shallowRef<IDBDatabase | null>(null)

  const store = shallowRef<IDBObjectStore | null>(null)

  const data = ref<D | null>(null) as Ref<D | null>

  watch(data, (value) => {
    if (database.value != null && store.value != null) {
      database.value.transaction(options.store ?? INDEXDB_OBJECT_STORE_NAME, 'readwrite').objectStore(options.store ?? INDEXDB_OBJECT_STORE_NAME).put(value, index)
    }
  })

  const create = async (): Promise<void> => {
    return await new Promise((resolve, reject) => {
      const dbReq = window.indexedDB.open(options.database ?? INDEXDB_DATABASE_NAME)

      dbReq.addEventListener(
        'success',
        () => {
          database.value = dbReq.result
        },
        {
          passive: true,
        },
      )

      dbReq.addEventListener(
        'upgradeneeded',
        () => {
          store.value = dbReq.result.createObjectStore(options.store ?? INDEXDB_OBJECT_STORE_NAME)

          const storeReq = dbReq.result.transaction(options.store ?? INDEXDB_OBJECT_STORE_NAME, 'readonly').objectStore(options.store ?? INDEXDB_OBJECT_STORE_NAME).get(index)
          storeReq.addEventListener(
            'success',
            () => {
              data.value = storeReq.result
              resolve()
            },
            {
              passive: true,
            },
          )
          storeReq.addEventListener(
            'error',
            () => {
              reject()
            },
            {
              passive: true,
            },
          )
        },
        {
          passive: true,
        },
      )

      dbReq.addEventListener(
        'error',
        () => {
          reject()
        },
        {
          passive: true,
        },
      )
    })
  }

  const destroy = async (): Promise<void> => {
    return await new Promise((resolve, reject) => {
      const dbReq = window.indexedDB.deleteDatabase(options.database ?? INDEXDB_DATABASE_NAME)

      dbReq.addEventListener(
        'success',
        () => {
          database.value = null
          store.value = null
          data.value = null
          resolve()
        },
        {
          passive: true,
        },
      )

      dbReq.addEventListener(
        'error',
        () => {
          reject()
        },
        {
          passive: true,
        },
      )
    })
  }

  if (options.initial == null || options.initial) {
    create()
  }

  return {
    data,
    database: shallowReadonly(database),
    store: shallowReadonly(store),
    create,
    destroy,
  }
}

export default useIndexedDB
