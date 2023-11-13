import { readonly, ref, shallowReadonly, shallowRef, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue'
import tryOnScopeDispose from './tryOnScopeDispose'

interface UseSpeechSynthesisOptions {
  /**
   * speech recognition language
   * @default 'en-US'
   */
  lang?: SpeechSynthesisUtterance['lang']

  /**
   * speech synthesis pitch value
   * @default 1
   */
  pitch?: SpeechSynthesisUtterance['pitch']

  /**
   * speech synthesis rate value
   * @default 1
   */
  rate?: SpeechSynthesisUtterance['rate']

  /**
   * speech synthesis volume value
   * @default 1
   */
  volume?: SpeechSynthesisUtterance['volume']

  /**
   * speech synthesis voice
   * @default null
   */
  voice?: SpeechSynthesisUtterance['voice']
}

interface UseSpeechSynthesisReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * speech synthesis play status
   */
  isPlaying: Ref<boolean>

  /**
   * speech synthesis status
   */
  status: DeepReadonly<Ref<'init' | 'play' | 'pause' | 'end'>>

  /**
   * speech synthesis error, if any
   */
  error: DeepReadonly<Ref<string | null>>

  /**
   * speech synthesis utterance, if any
   */
  utterance: Readonly<ShallowRef<SpeechSynthesisUtterance | null>>

  /**
   * method to start speech synthesis
   */
  start: () => void

  /**
   * method to pause speech synthesis
   */
  pause: () => void

  /**
   * method to resume speech synthesis
   */
  resume: () => void

  /**
   * method to stop speech synthesis
   */
  stop: () => void

  /**
   * method to toggle speech synthesis
   */
  toggle: () => void
}

/**
 * reactive speech synthesis
 * @param text speech synthesis text
 * @param options @see {@link UseSpeechSynthesisOptions}
 * @returns @see {@link UseSpeechSynthesisReturn}
 */
const useSpeechSynthesis = (text: MaybeRefOrGetter<string>, options: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn => {
  const { lang = 'en-US', pitch = 1, rate = 1, volume = 1, voice = null } = options

  const isSupported = 'speechSynthesis' in window

  const isPlaying = ref(false)

  const status = ref<'init' | 'play' | 'pause' | 'end'>('init')

  const error = ref<string | null>(null)

  const toggle = (): void => {
    isPlaying.value = !isPlaying.value
  }

  const start = (): void => {
    if (utterance.value === null || window.speechSynthesis.speaking) return

    window.speechSynthesis.speak(utterance.value)
  }

  const pause = (): void => {
    if (utterance.value === null || window.speechSynthesis.paused) return

    window.speechSynthesis.pause()
  }

  const resume = (): void => {
    if (utterance.value === null || !window.speechSynthesis.paused) return

    window.speechSynthesis.resume()
  }

  const stop = (): void => {
    if (utterance.value === null || !window.speechSynthesis.speaking) return

    window.speechSynthesis.cancel()
  }

  const utterance = shallowRef<SpeechSynthesisUtterance | null>(null)

  const update = (): void => {
    isPlaying.value = false
    status.value = 'init'

    const ssu = new window.SpeechSynthesisUtterance(toValue(text))

    ssu.lang = lang
    ssu.voice = voice
    ssu.pitch = pitch
    ssu.rate = rate
    ssu.volume = volume

    ssu.addEventListener(
      'start',
      () => {
        isPlaying.value = true
        status.value = 'play'
      },
      {
        passive: true,
      }
    )

    ssu.addEventListener(
      'pause',
      () => {
        isPlaying.value = false
        status.value = 'pause'
      },
      {
        passive: true,
      }
    )

    ssu.addEventListener(
      'resume',
      () => {
        isPlaying.value = true
        status.value = 'play'
      },
      {
        passive: true,
      }
    )

    ssu.addEventListener(
      'end',
      () => {
        isPlaying.value = false
        status.value = 'end'
      },
      {
        passive: true,
      }
    )

    ssu.addEventListener(
      'error',
      (e) => {
        error.value = e.error
      },
      {
        passive: true,
      }
    )

    utterance.value = ssu
  }

  if (isSupported) {
    update()

    watch(isPlaying, (isPlaying) => {
      if (isPlaying) {
        window.speechSynthesis.resume()
      } else {
        window.speechSynthesis.pause()
      }
    })
  }

  tryOnScopeDispose(() => {
    isPlaying.value = false
  })

  return {
    isSupported,
    isPlaying,
    status: readonly(status),
    error: readonly(error),
    utterance: shallowReadonly(utterance),
    start,
    pause,
    resume,
    stop,
    toggle,
  }
}

export default useSpeechSynthesis
