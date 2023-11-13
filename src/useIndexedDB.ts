import { shallowReadonly, shallowRef, type ShallowRef } from 'vue'
import { type Obj } from './util'

interface UseIndexedDBOptions {
  /**
   * database options
   */
  database: {
    /**
     * database name
     */
    name: string

    /**
     * database version
     */
    version?: number
  }

  /**
   * store options
   */
  store: {
    /**
     * store name
     */
    name: string

    /**
     * store auto increase
     */
    autoIncrement?: boolean

    /**
     * store key path
     */
    keyPath?: string | string[] | null

    /**
     * store indexes
     */
    indexes?: Array<{
      /**
       * store index name
       */
      name: string

      /**
       * store index keypath
       */
      keyPath: string | string[]

      /**
       * store index additional options
       */
      options?: {
        /**
         * store index unique symbol
         */
        unique?: boolean

        /**
         * store index multiple entry symbol
         */
        multiEntry?: boolean
      }
    }>
  }

  /**
   * callback to call if database abort
   */
  onDatabaseAbort?: (e: Event) => void

  /**
   * callback to call if database close
   */
  onDatabaseClose?: (e: Event) => void

  /**
   * callback to call if database occur error
   */
  onDatabaseError?: (e: Event) => void

  /**
   * callback to call if database's version change
   */
  onDatabaseVersionChange?: (e: IDBVersionChangeEvent) => void
}

interface UseIndexedDBReturn<D extends Obj> {
  /**
   * reference to database
   */
  database: Readonly<ShallowRef<IDBDatabase | null>>

  /**
   * reference to store
   */
  store: Readonly<ShallowRef<IDBObjectStore | null>>

  /**
   * method to create database
   */
  createDatabase: () => Promise<IDBDatabase>

  /**
   * method to close database
   */
  closeDatabase: () => Promise<Event>

  /**
   * method to delete database
   */
  deleteDatabase: () => Promise<Event>

  /**
   * method to enum databases
   */
  enumDatabases: () => Promise<IDBDatabaseInfo[]>

  /**
   * method to compare two operation keys
   */
  compareOperationKey: (first: unknown, second: unknown) => number

  /**
   * method to insert data
   */
  insertData: (data: D) => Promise<Event>

  /**
   * method to update data
   */
  updateData: (data: D) => Promise<Event>

  /**
   * method to delete data
   */
  deleteData: (query: IDBValidKey | IDBKeyRange) => Promise<Event>

  /**
   * method to select data
   */
  selectData: (query: IDBValidKey | IDBKeyRange) => Promise<Event>

  /**
   * method to select all datas
   */
  selectAllData: (query?: IDBValidKey | IDBKeyRange) => Promise<Event>

  /**
   * method to select data by index
   */
  selectDataByIndex: (name: string, query: IDBValidKey | IDBKeyRange) => Promise<Event>

  /**
   * method to traverse data
   */
  traverseData: (onData: (data: D) => void, query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection) => Promise<null>

  /**
   * method to traverse data by index
   */
  traverseDataByIndex: (name: string, onData: (data: D) => void, query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection) => Promise<null>

  /**
   * method to count data
   */
  countData: (query?: IDBValidKey | IDBKeyRange) => Promise<Event>

  /**
   * method to clear data
   */
  clearData: () => Promise<Event>
}

/**
 * reactive IndexedDB API
 * @param options @see {@link UseIndexedDBOptions}
 * @returns @see {@link UseIndexedDBReturn}
 */
const useIndexedDB = <D extends Obj>(options: UseIndexedDBOptions): UseIndexedDBReturn<D> => {
  const { database: db, store: os, onDatabaseAbort, onDatabaseClose, onDatabaseError, onDatabaseVersionChange } = options

  const database = shallowRef<IDBDatabase | null>(null)

  const store = shallowRef<IDBObjectStore | null>(null)

  const createDatabase = async (): Promise<IDBDatabase> => {
    return await new Promise((resolve, reject) => {
      const request = window.indexedDB.open(db.name, db.version)

      request.addEventListener(
        'success',
        (e) => {
          const db = (e.target as IDBOpenDBRequest).result

          database.value = db

          if (onDatabaseAbort !== undefined) {
            db.addEventListener('abort', onDatabaseAbort)
          }
          if (onDatabaseClose !== undefined) {
            db.addEventListener('close', onDatabaseClose)
          }
          if (onDatabaseError !== undefined) {
            db.addEventListener('error', onDatabaseError)
          }
          if (onDatabaseVersionChange !== undefined) {
            db.addEventListener('versionchange', onDatabaseVersionChange)
          }

          resolve(db)
        },
        {
          passive: true,
        }
      )

      request.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )

      request.addEventListener(
        'upgradeneeded',
        (e) => {
          const { name, autoIncrement = true, keyPath = 'id', indexes = [] } = os

          const db = (e.target as IDBOpenDBRequest).result

          const object = db.createObjectStore(name, {
            autoIncrement,
            keyPath,
          })

          indexes.forEach((index) => {
            const { name, keyPath, options } = index

            object.createIndex(name, keyPath, options)
          })
        },
        {
          passive: true,
        }
      )
    })
  }

  const closeDatabase = async (): Promise<Event> => {
    return await new Promise((resolve) => {
      database.value?.close()

      database.value?.addEventListener(
        'close',
        (e) => {
          database.value = null
          store.value = null
          resolve(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const deleteDatabase = async (): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(db.name)

      request.addEventListener(
        'success',
        (e) => {
          database.value = null
          store.value = null
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const enumDatabases = window.indexedDB.databases

  const compareOperationKey = window.indexedDB.cmp

  const insertData = async (data: D): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readwrite').objectStore(os.name).add(data)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const updateData = async (data: D): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readwrite').objectStore(os.name).put(data)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const deleteData = async (query: IDBValidKey | IDBKeyRange): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readwrite').objectStore(os.name).delete(query)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const selectData = async (query: IDBValidKey | IDBKeyRange): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readonly').objectStore(os.name).get(query)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const selectAllData = async (query?: IDBValidKey | IDBKeyRange, count?: number): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readonly').objectStore(os.name).getAll(query, count)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const selectDataByIndex = async (name: string, query: IDBValidKey | IDBKeyRange): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readonly').objectStore(os.name).index(name).get(query)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const traverseData = async (onData: (data: D) => void, query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection): Promise<null> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readonly').objectStore(os.name).openCursor(query, direction)

      request?.addEventListener(
        'success',
        (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result
          if (cursor !== null) {
            onData(cursor.value)
            cursor.continue()
          } else {
            resolve(null)
          }
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const traverseDataByIndex = async (name: string, onData: (data: D) => void, query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection): Promise<null> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readonly').objectStore(os.name).index(name).openCursor(query, direction)

      request?.addEventListener(
        'success',
        (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result
          if (cursor !== null) {
            onData(cursor.value)
            cursor.continue()
          } else {
            resolve(null)
          }
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const countData = async (query?: IDBValidKey | IDBKeyRange): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readonly').objectStore(os.name).count(query)

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  const clearData = async (): Promise<Event> => {
    return await new Promise((resolve, reject) => {
      const request = database.value?.transaction(os.name, 'readwrite').objectStore(os.name).clear()

      request?.addEventListener(
        'success',
        (e) => {
          resolve(e)
        },
        {
          passive: true,
        }
      )

      request?.addEventListener(
        'error',
        (e) => {
          reject(e)
        },
        {
          passive: true,
        }
      )
    })
  }

  return {
    database: shallowReadonly(database),
    store: shallowReadonly(store),
    createDatabase,
    closeDatabase,
    deleteDatabase,
    enumDatabases,
    compareOperationKey,
    insertData,
    updateData,
    deleteData,
    selectData,
    selectAllData,
    selectDataByIndex,
    traverseData,
    traverseDataByIndex,
    countData,
    clearData,
  }
}

export default useIndexedDB
