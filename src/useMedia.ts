import { type MaybeRefOrGetter, readonly, ref, type Ref, watch, toValue, shallowReadonly } from 'vue'
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

const transformTimeRanges = (timeRanges: TimeRanges) => {
  const len = timeRanges.length

  const ranges = Array<number>(len * 2)
  for (let i = 0; i < len; ++i) {
    ranges[i * 2 + 0] = timeRanges.start(i)
    ranges[i * 2 + 1] = timeRanges.end(i)
  }
  return ranges
}

const useMedia = <T extends HTMLVideoElement | HTMLAudioElement>(target: MaybeRefOrGetter<T | HTMLMediaElement | null | undefined>): {
  element: Readonly<MaybeRefOrGetter<T | HTMLMediaElement | null | undefined>>
  type: Readonly<Ref<MediaType>>
  readyState: Readonly<Ref<ReadyState>>
  networkState: Readonly<Ref<NetworkState>>
  playing: Readonly<Ref<boolean>>
  pausing: Readonly<Ref<boolean>>
  play: () => Promise<void>
  pause: () => Promise<void>
  volume: Ref<number>
  muted: Ref<boolean>
  rate: Ref<number>
  duration: Readonly<Ref<number>>
  currentTime: Ref<number>
  seeking: Readonly<Ref<boolean>>
  waiting: Readonly<Ref<boolean>>
  buffered: Readonly<Ref<readonly number[]>>
} => {
  const type = ref(MediaType.MEDIA)

  const readyState = ref<ReadyState>(ReadyState.HAVE_NOTHING)

  const networkState = ref<NetworkState>(NetworkState.NETWORK_EMPTY)

  const playing = ref(false)

  const pausing = ref(true)

  const play = async (): Promise<void> => {
    return toValue(target)?.play()
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
          playing.value = !target.paused
          pausing.value = target.paused
          waiting.value = false
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'loadeddata',
        () => {
          playing.value = !target.paused
          pausing.value = target.paused
          waiting.value = true
        },
        {
          passive: true,
        },
      )

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
          waiting.value = false
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
          waiting.value = true
        },
        {
          passive: true,
        },
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
        },
      )

      useEventListener(
        target,
        'ratechange',
        () => {
          rate.value = target.playbackRate
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'durationchange',
        () => {
          duration.value = target.duration
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'timeupdate',
        () => {
          currentTime.value = target.currentTime
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'seeking',
        () => {
          seeking.value = target.seeking
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'seeked',
        () => {
          seeking.value = target.seeking
        },
        {
          passive: true,
        },
      )

      useEventListener(
        target,
        'progress',
        () => {
          buffered.value = transformTimeRanges(target.buffered)
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
  }
}

export default useMedia
