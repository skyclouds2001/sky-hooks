import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseDeviceOrientationReturn {
  /**
   * whether or not the device is providing orientation data absolutely
   */
  absolute: DeepReadonly<Ref<boolean>>

  /**
   * the motion of the device around the z axis, express in degrees with values ranging from 0 to 360
   */
  alpha: DeepReadonly<Ref<number | null>>

  /**
   * the motion of the device around the x axis, express in degrees with values ranging from -180 to 180
   */
  beta: DeepReadonly<Ref<number | null>>

  /**
   * the motion of the device around the y axis, express in degrees with values ranging from -90 to 90
   */
  gamma: DeepReadonly<Ref<number | null>>
}

/**
 * reactive device orientation event
 * @returns @see {@link UseDeviceOrientationReturn}
 */
const useDeviceOrientation = (): UseDeviceOrientationReturn => {
  const absolute = ref(false)

  const alpha = ref<number | null>(null)

  const beta = ref<number | null>(null)

  const gamma = ref<number | null>(null)

  useEventListener(window, 'deviceorientation', (e) => {
    absolute.value = e.absolute
    alpha.value = e.alpha
    beta.value = e.beta
    gamma.value = e.gamma
  })

  useEventListener(window, 'deviceorientationabsolute', (e) => {
    absolute.value = (e as DeviceOrientationEvent).absolute
    alpha.value = (e as DeviceOrientationEvent).alpha
    beta.value = (e as DeviceOrientationEvent).beta
    gamma.value = (e as DeviceOrientationEvent).gamma
  })

  return {
    absolute: readonly(absolute),
    alpha: readonly(alpha),
    beta: readonly(beta),
    gamma: readonly(gamma),
  }
}

export default useDeviceOrientation
