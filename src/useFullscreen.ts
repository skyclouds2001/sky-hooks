import { type MaybeRefOrGetter, readonly, ref, type Ref, toValue, watch } from 'vue'
import { useEventListener } from '.'

const useFullscreen = (
  target: MaybeRefOrGetter<HTMLElement | null> = document.documentElement,
  options?: FullscreenOptions,
  onError?: (e: Event) => void
): {
  isSupported: boolean
  isFullscreen: Readonly<Ref<boolean>>
  enter: () => Promise<void>
  exit: () => Promise<void>
  toggle: () => Promise<void>
} => {
  const isSupported = 'fullscreenElement' in document && 'requestFullscreen' in Element.prototype && 'exitFullscreen' in document && document.fullscreenEnabled

  const isFullscreen = ref(document.fullscreenElement === toValue(target) && document.fullscreenElement != null)

  const enter = async (): Promise<void> => {
    if (!isSupported) return

    await toValue(target)?.requestFullscreen(options)

    isFullscreen.value = true
  }

  const exit = async (): Promise<void> => {
    if (!isSupported) return

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

    useEventListener(
      document,
      'fullscreenchange',
      () => {
        isFullscreen.value = document.fullscreenElement === toValue(target)
      },
      {
        passive: true,
      }
    )

    if (onError !== undefined) {
      useEventListener(document, 'fullscreenerror', onError, {
        passive: true,
      })
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
