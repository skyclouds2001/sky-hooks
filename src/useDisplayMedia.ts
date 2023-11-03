import { readonly, ref, shallowReadonly, shallowRef, watch, type DeepReadonly, type Ref, type ShallowRef } from 'vue'

const useDisplayMedia = (
  options: {
    audio?: boolean
    video?: true
  } = {}
): {
  isSupported: boolean
  isEnabled: DeepReadonly<Ref<boolean>>
  stream: Readonly<ShallowRef<MediaStream | null>>
  start: () => Promise<void>
  stop: () => Promise<void>
} => {
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

    isEnabled.value = stream.value !== null
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

  watch(
    isEnabled,
    (isEnabled) => {
      if (isEnabled) {
        void start()
      } else {
        void stop()
      }
    },
    { immediate: true }
  )

  return {
    isSupported,
    isEnabled: readonly(isEnabled),
    stream: shallowReadonly(stream),
    start,
    stop,
  }
}

export default useDisplayMedia
