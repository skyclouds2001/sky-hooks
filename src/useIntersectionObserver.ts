import tryOnScopeDispose from './tryOnScopeDispose'

interface UseIntersectionObserverReturn {
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
 * reactive IntersectionObserver
 * @param target observe target
 * @param callback observe callback
 * @param options observer options
 * @returns @see {@link UseIntersectionObserverReturn}
 */
const useIntersectionObserver = (target: Element | Element[], callback: IntersectionObserverCallback, options?: IntersectionObserverInit): UseIntersectionObserverReturn => {
  const isSupported = 'IntersectionObserver' in window

  let observer: IntersectionObserver | null = null

  const stop = (): void => {
    if (Array.isArray(target)) {
      target.forEach((target) => {
        observer?.unobserve(target)
      })
    } else {
      observer?.unobserve(target)
    }

    if (observer !== null) {
      observer.disconnect()
      observer = null
    }
  }

  if (isSupported) {
    observer = new window.IntersectionObserver(callback, options)

    if (Array.isArray(target)) {
      target.forEach((target) => {
        observer?.observe(target)
      })
    } else {
      observer?.observe(target)
    }

    tryOnScopeDispose(stop)
  }

  return {
    isSupported,
    stop,
  }
}

export default useIntersectionObserver
