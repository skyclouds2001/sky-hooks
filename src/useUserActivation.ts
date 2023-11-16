import { reactive, readonly } from 'vue'
import useAnimationFrame from './useAnimationFrame'
import useInterval from './useInterval'

interface UseUserActivationOptions<T extends 'AnimationFrame' | 'Interval', I extends T extends 'Interval' ? number : never = T extends 'Interval' ? number : never> {
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
 * reactive User Activation API
 * @param options @see {@link UseUserActivationOptions}
 * @returns user activation detail
 */
const useUserActivation = <T extends 'AnimationFrame' | 'Interval'>(options: UseUserActivationOptions<T> = {}): Readonly<Record<'hasBeenActive' | 'isActive', boolean>> => {
  const { immediate = true, mode = 'AnimationFrame', interval = 0 } = options

  const userActivation = reactive({
    hasBeenActive: false,
    isActive: false,
  })

  const update = (): void => {
    userActivation.hasBeenActive = navigator.userActivation.hasBeenActive
    userActivation.isActive = navigator.userActivation.isActive
  }

  switch (mode) {
    case 'AnimationFrame':
      useAnimationFrame(update, { immediate })
      break
    case 'Interval':
      useInterval(update, interval, { immediate })
      break
  }

  return readonly(userActivation)
}

export default useUserActivation
