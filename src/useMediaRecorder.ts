import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseMediaRecorderOptions {
  /**
   * callback to call when the dataavailable event of MediaRecorder happen
   */
  onDataAvailable?: (e: BlobEvent) => void

  /**
   * callback to call when the error event of MediaRecorder happen
   */
  onError?: (e: Event) => void

  /**
   * callback to call when the pause event of MediaRecorder happen
   */
  onPause?: (e: Event) => void

  /**
   * callback to call when the resume event of MediaRecorder happen
   */
  onResume?: (e: Event) => void

  /**
   * callback to call when the start event of MediaRecorder happen
   */
  onStart?: (e: Event) => void

  /**
   * callback to call when the stop event of MediaRecorder happen
   */
  onStop?: (e: Event) => void
}

interface UseMediaRecorderReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * media recorder state
   */
  state: DeepReadonly<Ref<RecordingState>>

  /**
   * start to record media
   */
  start: (stream: MediaStream, options?: MediaRecorderOptions) => void

  /**
   * pause to record media
   */
  pause: () => void

  /**
   * resume to record media
   */
  resume: () => void

  /**
   * stop to record media
   */
  stop: () => void
}

/**
 * reactive MediaStream Recording API
 * @param options @see {@link UseMediaRecorderOptions}
 * @returns @see {@link UseMediaRecorderReturn}
 */
const useMediaRecorder = (options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn => {
  const { onDataAvailable, onError, onPause, onResume, onStart, onStop } = options

  const isSupported = 'MediaRecorder' in window

  const state = ref<RecordingState>('inactive')

  let mediaRecorder: MediaRecorder | null = null

  const start = (stream: MediaStream, options?: MediaRecorderOptions): void => {
    if (!isSupported) return

    if (mediaRecorder !== null) return

    mediaRecorder = new window.MediaRecorder(stream, options)

    mediaRecorder.start()

    state.value = mediaRecorder.state

    if (onDataAvailable !== undefined) {
      useEventListener(mediaRecorder, 'dataavailable', onDataAvailable as (e: Event) => void)
    }

    if (onError !== undefined) {
      useEventListener(mediaRecorder, 'error', onError)
    }

    if (onPause !== undefined) {
      useEventListener(mediaRecorder, 'pause', onPause)
    }

    if (onResume !== undefined) {
      useEventListener(mediaRecorder, 'resume', onResume)
    }

    if (onStart !== undefined) {
      useEventListener(mediaRecorder, 'start', onStart)
    }

    if (onStop !== undefined) {
      useEventListener(mediaRecorder, 'stop', onStop)
    }
  }

  const pause = (): void => {
    if (!isSupported) return

    if (mediaRecorder === null) return

    if (mediaRecorder.state !== 'recording') return

    mediaRecorder.pause()

    state.value = mediaRecorder.state
  }

  const resume = (): void => {
    if (!isSupported) return

    if (mediaRecorder === null) return

    if (mediaRecorder.state !== 'paused') return

    mediaRecorder.resume()

    state.value = mediaRecorder.state
  }

  const stop = (): void => {
    if (!isSupported) return

    if (mediaRecorder === null) return

    mediaRecorder.stop()

    state.value = mediaRecorder.state

    mediaRecorder = null
  }

  return {
    isSupported,
    state: readonly(state),
    start,
    pause,
    resume,
    stop,
  }
}

export default useMediaRecorder
