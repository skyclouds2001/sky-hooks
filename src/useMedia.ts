import { type MaybeRefOrGetter, ref, watch, toValue } from 'vue'
import useEventListener from './useEventListener'

enum MediaType {
  UNKNOWN = 'unknown',
  AUDIO = 'audio',
  VIDEO = 'video',
}

const useMedia = (target: MaybeRefOrGetter<HTMLMediaElement | null | undefined>): any => {
  const element = toValue(target)

  const mediaType = ref(MediaType.UNKNOWN)

  const readyState = ref<HTMLMediaElement['HAVE_NOTHING' | 'HAVE_METADATA' | 'HAVE_CURRENT_DATA' | 'HAVE_FUTURE_DATA' | 'HAVE_ENOUGH_DATA']>(HTMLMediaElement.HAVE_NOTHING)

  const networkState = ref<HTMLMediaElement['NETWORK_EMPTY' | 'NETWORK_IDLE' | 'NETWORK_LOADING' | 'NETWORK_NO_SOURCE']>(HTMLMediaElement.NETWORK_EMPTY)

  const playing = ref(false)

  const pausing = ref(true)

  const play = async (): Promise<void> => {
    return toValue(target)?.play()
  }

  const pause = async (): Promise<void> => {
    return toValue(target)?.pause()
  }

  watch(
    () => toValue(target),
    (target) => {
      if (target == null) {
        mediaType.value = MediaType.UNKNOWN
        readyState.value = HTMLMediaElement.HAVE_NOTHING
        networkState.value = HTMLMediaElement.NETWORK_EMPTY
        playing.value = false
        pausing.value = true
        return
      }

      if (target instanceof HTMLAudioElement) {
        mediaType.value = MediaType.AUDIO
      } else if (target instanceof HTMLVideoElement) {
        mediaType.value = MediaType.VIDEO
      } else {
        mediaType.value = MediaType.UNKNOWN
      }

      if (playing.value) {
        target.play()
      }
      if (pausing.value) {
        target.pause()
      }

      useEventListener(
        target,
        'play',
        () => {
          playing.value = !target.paused
          pausing.value = target.paused
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'pause',
        () => {
          playing.value = !target.paused
          pausing.value = target.paused
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'playing',
        () => {
          playing.value = !target.paused
          pausing.value = target.paused
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'waiting',
        () => {
          playing.value = !target.paused
          pausing.value = target.paused
        },
        {
          passive: true,
        },
      )
    },
    {
      immediate: true,
    }
  )

  return {
    element,
    mediaType,
    readyState,
    networkState,
    playing,
    pausing,
    play,
    pause,
  }
}

export default useMedia
