import { readonly, ref, shallowReadonly, shallowRef, type DeepReadonly, type Ref, type ShallowRef } from 'vue'

type UseDisplayMediaOptions = Parameters<MediaDevices['getDisplayMedia']>[0]

interface UseDisplayMediaReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * whether currently is capture display media stream
   */
  isEnabled: DeepReadonly<Ref<boolean>>

  /**
   * the captured display media stream
   */
  stream: Readonly<ShallowRef<MediaStream | null>>

  /**
   * start to capture display media stream
   */
  start: () => Promise<void>

  /**
   * stop to capture display media stream
   */
  stop: () => Promise<void>
}

/**
 * reactive display media control
 * @param options @see {@link UseDisplayMediaOptions}
 * @returns @see {@link UseDisplayMediaReturn}
 */
const useDisplayMedia = (options: UseDisplayMediaOptions = {}): UseDisplayMediaReturn => {
  const { audio = false, video = true } = options

  const isSupported = 'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices

  const stream = shallowRef<MediaStream | null>(null)

  const isEnabled = ref(false)

  const start = async (): Promise<void> => {
    if (!isSupported) return

    if (stream.value !== null) return

    stream.value = await navigator.mediaDevices.getDisplayMedia({
      audio,
      video,
    })

    isEnabled.value = true
  }

  const stop = async (): Promise<void> => {
    if (!isSupported) return

    if (stream.value === null) return

    stream.value.getTracks().forEach((v) => {
      v.stop()
    })
    stream.value = null

    isEnabled.value = false
  }

  return {
    isSupported,
    isEnabled: readonly(isEnabled),
    stream: shallowReadonly(stream),
    start,
    stop,
  }
}

export default useDisplayMedia
