import { readonly, ref, shallowReadonly, shallowRef, type DeepReadonly, type Ref, type ShallowRef } from 'vue'

type UseUserMediaOptions = Parameters<MediaDevices['getUserMedia']>[0]

interface UseUserMediaReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * whether currently is capture user media stream
   */
  isEnabled: DeepReadonly<Ref<boolean>>

  /**
   * the captured user media stream
   */
  stream: Readonly<ShallowRef<MediaStream | null>>

  /**
   * start to capture user media stream
   */
  start: () => Promise<void>

  /**
   * stop to capture user media stream
   */
  stop: () => Promise<void>
}

/**
 * reactive user media control
 * @param options @see {@link UseUserMediaOptions}
 * @returns @see {@link UseUserMediaReturn}
 */
const useUserMedia = (options: UseUserMediaOptions = {}): UseUserMediaReturn => {
  const { audio = false, video = true } = options

  const isSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices

  const isEnabled = ref(false)

  const stream = shallowRef<MediaStream | null>(null)

  const start = async (): Promise<void> => {
    if (!isSupported) return

    if (stream.value !== null) return

    stream.value = await navigator.mediaDevices.getUserMedia({
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

export default useUserMedia
