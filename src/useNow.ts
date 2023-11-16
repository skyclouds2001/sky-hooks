import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useAnimationFrame from './useAnimationFrame'
import useInterval from './useInterval'

interface UseNowOptions<T extends 'AnimationFrame' | 'Interval', I extends T extends 'Interval' ? number : never = T extends 'Interval' ? number : never> {
  /**
   * whether to call callback function immediately
   * @default true
   */
  immediate?: boolean

  /**
   * update the timestamp via `setInterval()` or `requestAnimationFrame()`
   * @default 'AnimationFrame'
   */
  mode?: T

  /**
   * the interval number passing to `setInterval()` if `mode` is set to `'Interval'`
   * @default 0
   */
  interval?: I
}

/**
 * reactive date
 * @param options @see {@link UseNowOptions}
 * @returns the reactive date
 */
const useNow = <T extends 'AnimationFrame' | 'Interval'>(options: UseNowOptions<T> = {}): DeepReadonly<Ref<Date>> => {
  const { immediate = true, mode = 'AnimationFrame', interval = 0 } = options

  const now = ref(new Date())

  const update = (): void => {
    now.value = new Date()
  }

  switch (mode) {
    case 'AnimationFrame':
      useAnimationFrame(update, { immediate })
      break
    case 'Interval':
      useInterval(update, interval, { immediate })
      break
  }

  return readonly(now)
}

export default useNow
