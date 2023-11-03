import { toValue, type MaybeRefOrGetter } from 'vue'
import { type Fn } from './util'

/**
 * throttle function
 * @param fn callback function
 * @param timeout timeout delay
 * @returns wrapped function
 */
const useThrottle = <F extends Fn>(fn: F, timeout: MaybeRefOrGetter<number>): ((...args: Parameters<F>) => void) => {
  let timer: number | null = null

  return (...args) => {
    if (timer === null) {
      timer = window.setTimeout(() => {
        fn(...args)
        timer = null
      }, toValue(timeout))
    }
  }
}

export default useThrottle
