import tryOnScopeDispose from './tryOnScopeDispose'

interface UseMutationObserverReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * method to stop observe
   */
  stop: () => void
}

/**
 * reactive MutationObserver
 * @param target observe target dom element
 * @param callback observe callback
 * @param options observer options
 * @returns @see {@link UseMutationObserverReturn}
 */
const useMutationObserver = (target: Node, callback: MutationCallback, options?: MutationObserverInit): UseMutationObserverReturn => {
  const isSupported = 'MutationObserver' in window

  let observer: MutationObserver | null = null

  const stop = (): void => {
    if (observer !== null) {
      observer.disconnect()
      observer = null
    }
  }

  if (isSupported) {
    observer = new window.MutationObserver(callback)

    observer.observe(target, options)

    tryOnScopeDispose(stop)
  }

  return {
    isSupported,
    stop,
  }
}

export default useMutationObserver
