import tryOnScopeDispose from './tryOnScopeDispose'

type Listener<T = string, P extends unknown[] = unknown[]> = (event: T, ...payload: P) => void

const mappers = new Map()

interface UseEventBusReturn<T extends string | number | symbol = string, P extends unknown[] = unknown[]> {
  /**
   * add a listener
   * @param listener listener
   */
  on: (listener: Listener<T, P>) => void

  /**
   * close a listener
   * @param listener listener
   */
  off: (listener: Listener<T, P>) => void

  /**
   * add a listener that only calls once
   * @param listener listener
   */
  once: (listener: Listener<T, P>) => void

  /**
   * emit a listener event
   * @param listener listener
   * @param payload listener payloads
   */
  emit: (event: T, ...payload: P) => void

  /**
   * reset all listeners
   * @param listener listener
   */
  reset: () => void
}

/**
 * reactive event bus
 * @param key event
 * @returns @see {@link UseEventBusReturn}
 */
const useEventBus = <T extends string | number | symbol = string, P extends unknown[] = unknown[]>(key: T): UseEventBusReturn<T, P> => {
  const events = mappers as Map<T, Set<Listener<T, P>>>

  const on = (listener: Listener<T, P>): void => {
    const listeners = events.get(key) ?? new Set()
    listeners.add(listener)
    events.set(key, listeners)

    tryOnScopeDispose(() => {
      off(listener)
    })
  }

  const off = (listener: Listener<T, P>): void => {
    const listeners = events.get(key)
    listeners?.delete(listener)
    events.set(key, listeners ?? new Set())
  }

  const once = (listener: Listener<T, P>): void => {
    on((event, ...payload) => {
      off(listener)
      listener(event, ...payload)
    })
  }

  const emit = (event: T, ...payload: P): void => {
    events.get(key)?.forEach((listener) => {
      listener(event, ...payload)
    })
  }

  const reset = (): void => {
    events.delete(key)
  }

  return {
    on,
    off,
    once,
    emit,
    reset,
  }
}

export default useEventBus
