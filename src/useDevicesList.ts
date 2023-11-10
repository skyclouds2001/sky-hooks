import { computed, shallowRef, type ComputedRef, type ShallowRef } from 'vue'
import usePermission from './usePermission'
import useEventListener from './useEventListener'

interface UseDevicesListOptions {
  /**
   * whether immediate load media devices list, which may request permission immediate
   */
  immediate?: boolean
}

interface UseDevicesListReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * media devices list
   */
  devices: ShallowRef<MediaDeviceInfo[]>

  /**
   * video input media devices list
   */
  videoInputs: ComputedRef<MediaDeviceInfo[]>

  /**
   * audio input media devices list
   */
  audioInputs: ComputedRef<MediaDeviceInfo[]>

  /**
   * audio output media devices list
   */
  audioOutputs: ComputedRef<MediaDeviceInfo[]>
}

/**
 * reactive media devices list
 * @param options @see {@link UseDevicesListOptions}
 * @returns @see {@link UseDevicesListReturn}
 */
const useDevicesList = (options: UseDevicesListOptions = {}): UseDevicesListReturn => {
  const { immediate = false } = options

  const isSupported = 'mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices

  const devices = shallowRef<MediaDeviceInfo[]>([])

  const videoInputs = computed(() => devices.value?.filter((device) => device.kind === 'videoinput'))
  const audioInputs = computed(() => devices.value?.filter((device) => device.kind === 'audioinput'))
  const audioOutputs = computed(() => devices.value?.filter((device) => device.kind === 'audiooutput'))

  const camera = usePermission('camera')
  const microphone = usePermission('microphone')

  const update = async (): Promise<void> => {
    if (!isSupported) return

    if (camera.status.value !== 'granted' || microphone.status.value !== 'granted') {
      await requestPermission()
    }

    devices.value = await navigator.mediaDevices.enumerateDevices()
  }

  const requestPermission = async (): Promise<void> => {
    if (!isSupported) return

    if (camera.status.value === 'granted' && microphone.status.value === 'granted') return

    await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
  }

  if (isSupported) {
    useEventListener(navigator.mediaDevices, 'devicechange', () => {
      void update()
    })

    if (immediate) {
      void update()
    }
  }

  return {
    isSupported,
    devices,
    videoInputs,
    audioInputs,
    audioOutputs,
  }
}

export default useDevicesList
