import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useAnimationFrame from './useAnimationFrame'
import useInterval from './useInterval'

interface UseTimestampOptions {
  /**
   * offset of the timestamp
   * @default 0
   */
  offset?: number

  /**
   * whether to call callback function immediately
   * @default true
   */
  immediate?: boolean

  /**
   * update the timestamp via `setInterval()` or `requestAnimationFrame()`
   * @default 'AnimationFrame'
   */
  mode?: 'AnimationFrame' | 'Interval'

  /**
   * the interval number passing to `setInterval()` if `mode` is set to `'Interval'`
   * @default 0
   */
  interval?: number
}

/**
 * reactive timestamp
 * @param options @see {@link UseTimestampOptions}
 * @returns the reactive timestamp
 */
const useTimestamp = (options: UseTimestampOptions = {}): DeepReadonly<Ref<number>> => {
  const { offset = 0, immediate = true, mode = 'AnimationFrame', interval = 0 } = options

  const timestamp = ref(Date.now() + offset)

  const update = (): void => {
    timestamp.value = Date.now() + offset
  }

  switch (mode) {
    case 'AnimationFrame':
      useAnimationFrame(update, { immediate })
      break
    case 'Interval':
      useInterval(update, interval, { immediate })
      break
  }

  return readonly(timestamp)
}

export default useTimestamp
