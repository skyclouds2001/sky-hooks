import { type MaybeRefOrGetter, readonly, ref, type Ref, toValue, watch } from 'vue'
import { useEventListener } from '.'

interface UseFullscreenReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * fullscreen status of the specified element
   */
  isFullscreen: Readonly<Ref<boolean>>

  /**
   * enter fullscreen status of the specified element
   */
  enter: () => Promise<void>

  /**
   * exit fullscreen status of the specified element
   */
  exit: () => Promise<void>

  /**
   * toggle fullscreen status of the specified element
   */
  toggle: () => Promise<void>
}

/**
 * reactive Fullscreen API
 * @param target control target
 * @param options optional fullscreen options
 * @param onError optional handle to call if fullscreen status toggle fail
 * @returns @see {@link UseFullscreenReturn}
 */
const useFullscreen = (target: MaybeRefOrGetter<HTMLElement | null> = document.documentElement, options?: FullscreenOptions, onError?: (e: Event) => void): UseFullscreenReturn => {
  const isSupported = 'fullscreenElement' in document && 'requestFullscreen' in Element.prototype && 'exitFullscreen' in document && document.fullscreenEnabled

  const isFullscreen = ref(document.fullscreenElement === toValue(target) && document.fullscreenElement != null)

  const enter = async (): Promise<void> => {
    if (!isSupported) return

    if (document.fullscreenElement != null) return

    await toValue(target)?.requestFullscreen(options)

    isFullscreen.value = true
  }

  const exit = async (): Promise<void> => {
    if (!isSupported) return

    if (document.fullscreenElement == null) return

    await document.exitFullscreen()

    isFullscreen.value = false
  }

  const toggle = async (): Promise<void> => {
    await (isFullscreen.value ? exit() : enter())
  }

  if (isSupported) {
    watch(
      () => toValue(target),
      (target) => {
        if (target === null) return

        void (isFullscreen.value ? enter() : exit())
      },
      {
        immediate: true,
      }
    )

    useEventListener(document, 'fullscreenchange', () => {
      isFullscreen.value = document.fullscreenElement === toValue(target)
    })

    if (onError !== undefined) {
      useEventListener(document, 'fullscreenerror', onError)
    }
  }

  return {
    isSupported,
    isFullscreen: readonly(isFullscreen),
    enter,
    exit,
    toggle,
  }
}

export default useFullscreen
