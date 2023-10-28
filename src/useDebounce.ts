import { type MaybeRefOrGetter, toValue } from 'vue'
import { type Fn } from '.'

/**
 * debounce function
 * @param fn callback function
 * @param timeout timeout delay
 * @returns wrapped function
 */
const useDebounce = <F extends Fn>(fn: F, timeout: MaybeRefOrGetter<number>): ((...args: Parameters<F>) => void) => {
  let timer: number | null = null

  return (...args) => {
    if (timer !== null) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      fn(...args)
      timer = null
    }, toValue(timeout))
  }
}

export default useDebounce
