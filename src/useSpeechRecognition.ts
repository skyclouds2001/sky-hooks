import { readonly, ref, shallowReadonly, shallowRef, watch, type DeepReadonly, type Ref, type ShallowRef } from 'vue'
import tryOnScopeDispose from './tryOnScopeDispose'

const grammar = `
#JSGF V1.0;
grammar colors;
public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;
`.trim()

interface UseSpeechRecognitionOptions {
  /**
   * speech recognition language
   * @default 'en-US'
   */
  lang?: SpeechRecognition['lang']

  /**
   * speech recognition continuous flag
   * @default false
   */
  continuous?: SpeechRecognition['continuous']

  /**
   * speech recognition interim result flag
   * @default false
   */
  interimResults?: SpeechRecognition['interimResults']

  /**
   * speech recognition interim result flag
   * @default 1
   */
  maxAlternatives?: SpeechRecognition['maxAlternatives']
}

interface UseSpeechRecognitionReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * speech recognition instance
   */
  recognition: Readonly<ShallowRef<SpeechRecognition | null>>

  /**
   * speech recognition listen status
   */
  isListening: Ref<boolean>

  /**
   * speech recognition finish status
   */
  isFinished: DeepReadonly<Ref<boolean>>

  /**
   * speech recognition result
   */
  result: DeepReadonly<Ref<string>>

  /**
   * speech recognition error, if any
   */
  error: Readonly<ShallowRef<SpeechRecognitionErrorEvent | null>>

  /**
   * method to start speech recognition
   */
  start: () => void

  /**
   * method to stop speech recognition
   */
  stop: () => void

  /**
   * method to toggle speech recognition
   */
  toggle: () => void
}

/**
 * reactive speech recognition
 * @param options @see {@link UseSpeechRecognitionOptions}
 * @returns @see {@link UseSpeechRecognitionReturn}
 */
const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
  const { lang = 'en-US', continuous = false, interimResults = false, maxAlternatives = 1 } = options

  const isSupported = 'SpeechRecognition' in window

  const recognition = shallowRef<SpeechRecognition | null>(null)

  const isListening = ref(false)

  const isFinished = ref(false)

  const result = shallowRef('')

  const error = shallowRef<SpeechRecognitionErrorEvent | null>(null)

  const start = (): void => {
    isListening.value = true
  }

  const stop = (): void => {
    isListening.value = false
  }

  const toggle = (): void => {
    isListening.value = !isListening.value
  }

  if (isSupported) {
    const rec = new window.SpeechRecognition()

    const gra = new window.SpeechGrammarList()
    gra.addFromString(grammar, 1)

    rec.continuous = continuous
    rec.grammars = gra
    rec.interimResults = interimResults
    rec.lang = lang
    rec.maxAlternatives = maxAlternatives

    rec.addEventListener(
      'start',
      () => {
        isListening.value = true
        isFinished.value = false
      },
      {
        passive: true,
      }
    )

    rec.addEventListener(
      'result',
      (e) => {
        result.value = Array.from(e.results)
          .map((res) => {
            isFinished.value ||= res.isFinal
            return res.item(0)
          })
          .map((res) => res.transcript)
          .join('')
        error.value = null
      },
      {
        passive: true,
      }
    )

    rec.addEventListener(
      'error',
      (e) => {
        error.value = e
      },
      {
        passive: true,
      }
    )

    rec.addEventListener(
      'end',
      () => {
        isListening.value = false
      },
      {
        passive: true,
      }
    )

    watch(isListening, (isListening) => {
      if (isListening) {
        rec.start()
      } else {
        rec.stop()
      }
    })

    recognition.value = rec
  }

  tryOnScopeDispose(() => {
    isListening.value = false
  })

  return {
    isSupported,
    recognition: shallowReadonly(recognition),
    isListening,
    isFinished: readonly(isFinished),
    result: readonly(result),
    error: shallowReadonly(error),
    start,
    stop,
    toggle,
  }
}

export default useSpeechRecognition
