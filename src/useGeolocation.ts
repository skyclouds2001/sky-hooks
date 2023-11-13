import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import tryOnMounted from './tryOnMounted'
import tryOnUnmounted from './tryOnUnmounted'
import usePermission from './usePermission'

interface UseGeolocationOptions {
  /**
   *  whether likely to receive the best possible results
   * @default false
   */
  enableHighAccuracy?: boolean

  /**
   * the maximum age in milliseconds of a possible cached position that is acceptable to return
   * @default 0
   */
  maximumAge?: number

  /**
   * the maximum length of time in milliseconds that the device is allowed to take in order to return a position
   * @default Infinity
   */
  timeout?: number
}

interface UseGeolocationReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * geolocation permission status
   */
  permission: ReturnType<typeof usePermission>['status']

  /**
   * geolocation information
   */
  geolocation: DeepReadonly<Ref<GeolocationCoordinates>>

  /**
   * geolocation information recently updated timestamp
   */
  locatedAt: DeepReadonly<Ref<number | null>>

  /**
   * geolocation information error if has
   */
  error: DeepReadonly<Ref<GeolocationPositionError | null>>
}

/**
 * reactive Geolocation API
 * @param options @see {@link UseGeolocationOptions}
 * @returns @see {@link UseGeolocationReturn}
 */
const useGeolocation = (options?: UseGeolocationOptions): UseGeolocationReturn => {
  const isSupported = 'geolocation' in navigator

  const { status: permission } = usePermission('geolocation')

  const location = ref<GeolocationCoordinates>({
    accuracy: 0,
    latitude: Infinity,
    longitude: Infinity,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  })

  const locatedAt = ref<number | null>(null)

  const error = ref<GeolocationPositionError | null>(null)

  let watcher: number | null = null

  if (isSupported) {
    tryOnMounted(() => {
      watcher = navigator.geolocation.watchPosition(
        (geo) => {
          location.value = geo.coords
          error.value = null
          locatedAt.value = geo.timestamp
        },
        (err) => {
          error.value = err
        },
        options
      )
    })

    tryOnUnmounted(() => {
      if (watcher !== null) {
        navigator.geolocation.clearWatch(watcher)
      }
    })
  }

  return {
    isSupported,
    permission,
    geolocation: readonly(location),
    locatedAt: readonly(locatedAt),
    error: readonly(error),
  }
}

export default useGeolocation
