import { readonly, ref, type Ref } from 'vue'

interface UseDeviceMotionReturn {
  /**
   * the acceleration of the device on the three axis X, Y and Z
   */
  acceleration: Readonly<Ref<DeviceMotionEventAcceleration>>

  /**
   * the acceleration of the device on the three axis X, Y and Z with the effect of gravity
   */
  accelerationIncludingGravity: Readonly<Ref<DeviceMotionEventAcceleration>>

  /**
   * the rate of change of the device's orientation on the three orientation axis alpha, beta and gamma
   */
  rotationRate: Readonly<Ref<DeviceMotionEventRotationRate>>

  /**
   * representing the interval of time, in milliseconds, at which data is obtained from the device
   */
  interval: Readonly<Ref<number>>
}

/**
 * reactive device motion
 * @returns @see{@link UseDeviceMotionReturn}
 */
const useDeviceMotion = (): UseDeviceMotionReturn => {
  const interval = ref(0)

  const acceleration = ref({
    x: null,
    y: null,
    z: null,
  })

  const accelerationIncludingGravity = ref({
    x: null,
    y: null,
    z: null,
  })

  const rotationRate = ref({
    alpha: null,
    beta: null,
    gamma: null,
  })

  return {
    acceleration: readonly(acceleration),
    accelerationIncludingGravity: readonly(accelerationIncludingGravity),
    rotationRate: readonly(rotationRate),
    interval: readonly(interval),
  }
}

export default useDeviceMotion
