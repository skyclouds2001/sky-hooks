import { readonly, ref, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue'
import useEventListener from './useEventListener'

enum MediaType {
  MEDIA = 'media',
  AUDIO = 'audio',
  VIDEO = 'video',
}

enum ReadyState {
  HAVE_NOTHING = HTMLMediaElement.HAVE_NOTHING,
  HAVE_METADATA = HTMLMediaElement.HAVE_METADATA,
  HAVE_CURRENT_DATA = HTMLMediaElement.HAVE_CURRENT_DATA,
  HAVE_FUTURE_DATA = HTMLMediaElement.HAVE_FUTURE_DATA,
  HAVE_ENOUGH_DATA = HTMLMediaElement.HAVE_ENOUGH_DATA,
}

enum NetworkState {
  NETWORK_EMPTY = HTMLMediaElement.NETWORK_EMPTY,
  NETWORK_IDLE = HTMLMediaElement.NETWORK_IDLE,
  NETWORK_LOADING = HTMLMediaElement.NETWORK_LOADING,
  NETWORK_NO_SOURCE = HTMLMediaElement.NETWORK_NO_SOURCE,
}

const transformTimeRanges = (timeRanges: TimeRanges): number[] => {
  const len = timeRanges.length

  const ranges = Array<number>(len * 2)
  for (let i = 0; i < len; ++i) {
    ranges[i * 2 + 0] = timeRanges.start(i)
    ranges[i * 2 + 1] = timeRanges.end(i)
  }
  return ranges
}

const useMediaElement = <T extends HTMLVideoElement | HTMLAudioElement>(
  target: MaybeRefOrGetter<T | HTMLMediaElement | null | undefined>
): {
  element: MaybeRefOrGetter<T | HTMLMediaElement | null | undefined>
  type: DeepReadonly<Ref<MediaType>>
  readyState: DeepReadonly<Ref<ReadyState>>
  networkState: DeepReadonly<Ref<NetworkState>>
  playing: DeepReadonly<Ref<boolean>>
  pausing: DeepReadonly<Ref<boolean>>
  play: () => Promise<void>
  pause: () => Promise<void>
  volume: Ref<number>
  muted: Ref<boolean>
  rate: Ref<number>
  duration: DeepReadonly<Ref<number>>
  currentTime: Ref<number>
  seeking: DeepReadonly<Ref<boolean>>
  waiting: DeepReadonly<Ref<boolean>>
  buffered: DeepReadonly<Ref<readonly number[]>>
  error: DeepReadonly<Ref<MediaError | null>>
} => {
  const type = ref(MediaType.MEDIA)

  const readyState = ref<ReadyState>(ReadyState.HAVE_NOTHING)

  const networkState = ref<NetworkState>(NetworkState.NETWORK_EMPTY)

  const playing = ref(false)

  const pausing = ref(true)

  const play = async (): Promise<void> => {
    return await toValue(target)?.play()
  }

  const pause = async (): Promise<void> => {
    return toValue(target)?.pause()
  }

  const volume = ref(1.0)

  const muted = ref(false)

  const rate = ref(1.0)

  const duration = ref(NaN)

  const currentTime = ref(0)

  const seeking = ref(false)

  const waiting = ref(false)

  const buffered = ref<number[]>([])

  const error = ref<MediaError | null>(null)

  watch(volume, (volume) => {
    const el = toValue(target)
    if (el != null) {
      el.volume = volume
    }
  })

  watch(muted, (muted) => {
    const el = toValue(target)
    if (el != null) {
      el.muted = muted
    }
  })

  watch(rate, (rate) => {
    const el = toValue(target)
    if (el != null) {
      el.playbackRate = rate
    }
  })

  watch(currentTime, (currentTime) => {
    const el = toValue(target)
    if (el != null) {
      el.currentTime = Math.max(Math.min(currentTime, duration.value), 0)
    }
  })

  watch(
    () => toValue(target),
    (target) => {
      if (target == null) {
        type.value = MediaType.MEDIA

        readyState.value = ReadyState.HAVE_NOTHING
        networkState.value = NetworkState.NETWORK_EMPTY

        playing.value = false
        pausing.value = true
        volume.value = 1.0
        muted.value = false
        rate.value = 1.0
        duration.value = NaN
        currentTime.value = 0
        seeking.value = false
        waiting.value = false
        buffered.value = []
        return
      }

      if (target instanceof HTMLAudioElement) {
        type.value = MediaType.AUDIO
      } else if (target instanceof HTMLVideoElement) {
        type.value = MediaType.VIDEO
      } else {
        type.value = MediaType.MEDIA
      }

      readyState.value = target.readyState
      networkState.value = target.networkState

      playing.value = !target.paused
      pausing.value = target.paused
      volume.value = target.volume
      muted.value = target.muted
      rate.value = target.playbackRate
      duration.value = target.duration
      currentTime.value = target.currentTime
      seeking.value = target.seeking
      waiting.value = false
      buffered.value = transformTimeRanges(target.buffered)

      useEventListener(
        target,
        'loadstart',
        () => {
          readyState.value = target.readyState
          networkState.value = target.networkState

          playing.value = !target.paused
          pausing.value = target.paused
          waiting.value = false
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'loadedmetadata',
        () => {
          readyState.value = target.readyState
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'loadeddata',
        () => {
          readyState.value = target.readyState

          playing.value = !target.paused
          pausing.value = target.paused
          waiting.value = true
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'canplay',
        () => {
          readyState.value = target.readyState
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'canplaythrough',
        () => {
          readyState.value = target.readyState
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'play',
        () => {
          readyState.value = target.readyState

          playing.value = !target.paused
          pausing.value = target.paused
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'pause',
        () => {
          readyState.value = target.readyState

          playing.value = !target.paused
          pausing.value = target.paused
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'playing',
        () => {
          readyState.value = target.readyState

          playing.value = !target.paused
          pausing.value = target.paused
          waiting.value = false
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'waiting',
        () => {
          readyState.value = target.readyState

          playing.value = !target.paused
          pausing.value = target.paused
          waiting.value = true
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'volumechange',
        () => {
          volume.value = target.volume
          muted.value = target.muted
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'ratechange',
        () => {
          rate.value = target.playbackRate
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'durationchange',
        () => {
          duration.value = target.duration
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'timeupdate',
        () => {
          readyState.value = target.readyState

          currentTime.value = target.currentTime
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'seeking',
        () => {
          readyState.value = target.readyState

          seeking.value = target.seeking
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'seeked',
        () => {
          readyState.value = target.readyState

          seeking.value = target.seeking
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'progress',
        () => {
          networkState.value = target.networkState

          buffered.value = transformTimeRanges(target.buffered)
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'suspend',
        () => {
          networkState.value = target.networkState
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'abort',
        () => {
          networkState.value = target.networkState

          error.value = target.error
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'error',
        () => {
          networkState.value = target.networkState

          error.value = target.error
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'emptied',
        () => {
          networkState.value = target.networkState
        },
        {
          passive: true,
        }
      )

      useEventListener(
        target,
        'stalled',
        () => {
          networkState.value = target.networkState
        },
        {
          passive: true,
        }
      )
    },
    {
      immediate: true,
    }
  )

  return {
    element: target,
    type: readonly(type),
    readyState: readonly(readyState),
    networkState: readonly(networkState),
    playing: readonly(playing),
    pausing: readonly(pausing),
    play,
    pause,
    volume,
    muted,
    rate,
    duration: readonly(duration),
    currentTime,
    seeking: readonly(seeking),
    waiting: readonly(waiting),
    buffered: readonly(buffered),
    error: readonly(error),
  }
}

export default useMediaElement
