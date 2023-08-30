import { type MaybeRefOrGetter, ref, type Ref, watch, toValue } from 'vue'
import useEventListener from './useEventListener'

enum MediaType {
  UNKNOWN = 'unknown',
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

const useMedia = (target: MaybeRefOrGetter<HTMLMediaElement | null | undefined>): {
  element: HTMLMediaElement | null | undefined
  type: Ref<MediaType>
  playing: Ref<boolean>
  pausing: Ref<boolean>
  play: () => Promise<void>
  pause: () => Promise<void>
  volume: Ref<number>
  muted: Ref<boolean>
  rate: Ref<number>
  duration: Ref<number>
  readyState: Ref<ReadyState>
  networkState: Ref<NetworkState>
} => {
  const element = toValue(target)

  const type = ref(MediaType.UNKNOWN)

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

  const readyState = ref<ReadyState>(ReadyState.HAVE_NOTHING)

  const networkState = ref<NetworkState>(NetworkState.NETWORK_EMPTY)

  watch(volume, (volume) => {
    if (element != null) {
      element.volume = volume
    }
  })

  watch(muted, (muted) => {
    if (element != null) {
      element.muted = muted
    }
  })

  watch(rate, (rate) => {
    if (element != null) {
      element.playbackRate = rate
    }
  })

  watch(
    () => toValue(target),
    (target) => {
      if (target == null) {
        type.value = MediaType.UNKNOWN
        playing.value = false
        pausing.value = true
        volume.value = 1.0
        muted.value = false
        rate.value = 1.0
        duration.value = NaN
        readyState.value = ReadyState.HAVE_NOTHING
        networkState.value = NetworkState.NETWORK_EMPTY
        return
      }

      if (target instanceof HTMLAudioElement) {
        type.value = MediaType.AUDIO
      } else if (target instanceof HTMLVideoElement) {
        type.value = MediaType.VIDEO
      } else {
        type.value = MediaType.UNKNOWN
      }

      playing.value = !target.paused
      pausing.value = target.paused
      volume.value = target.volume
      muted.value = target.muted
      rate.value = target.playbackRate
      duration.value = target.duration
      readyState.value = target.readyState
      networkState.value = target.networkState

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
    },
    {
      immediate: true,
    }
  )

  return {
    element,
    type,
    playing,
    pausing,
    play,
    pause,
    volume,
    muted,
    rate,
    duration,
    readyState,
    networkState,
  }
}

export default useMedia
