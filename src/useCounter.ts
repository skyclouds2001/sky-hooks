import { readonly, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

interface UseCounterOptions {
  /**
   * the minium value of the counter
   * @default -Infinity
   */
  min?: MaybeRefOrGetter<number>

  /**
   * the maximum value of the counter
   * @default +Infinity
   */
  max?: MaybeRefOrGetter<number>

  /**
   * the initial value of the counter
   * @default 0
   */
  initial?: number
}

interface UseCounterReturn {
  /**
   * the value of the counter
   */
  count: Readonly<Ref<number>>

  /**
   * increase the value of the counter
   * @param delta the delta to increase, default to `1`
   */
  increase: (delta?: number) => void

  /**
   * decrease the value of the counter
   * @param delta the delta to decrease, default to `1`
   */
  decrease: (delta?: number) => void

  /**
   * get the value of the counter
   * @returns the value of the counter
   */
  get: () => number

  /**
   * set the value of the counter
   * @param val the specific value to set to the counter
   */
  set: (val: number) => void

  /**
   * reset the value of the counter to the initial value
   */
  reset: () => void
}

/**
 * hook for counter
 * @param options @see {@link UseCounterOptions}
 * @returns @see {@link UseCounterReturn}
 */
const useCounter = (options: UseCounterOptions = {}): UseCounterReturn => {
  const { min = -Infinity, max = +Infinity, initial = 0 } = options

  const count = ref(Math.max(toValue(min), Math.min(toValue(max), initial)))

  const increase = (delta = 1): void => {
    count.value = Math.min(toValue(max), count.value + delta)
  }

  const decrease = (delta = 1): void => {
    count.value = Math.max(toValue(min), count.value - delta)
  }

  const get = (): number => count.value

  const set = (val: number): void => {
    count.value = Math.max(toValue(min), Math.min(toValue(max), val))
  }

  const reset = (): void => {
    count.value = Math.max(toValue(min), Math.min(toValue(max), initial))
  }

  watch(
    () => toValue(max),
    (max) => {
      count.value = Math.min(count.value, max)
    }
  )

  watch(
    () => toValue(min),
    (min) => {
      count.value = Math.max(count.value, min)
    }
  )

  return {
    count: readonly(count),
    increase,
    decrease,
    get,
    set,
    reset,
  }
}

export default useCounter
