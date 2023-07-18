import { readonly, ref, type Ref } from 'vue'
import { useEventListener } from '.'

const useFullscreen = (
  target: HTMLElement = document.documentElement,
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

  const isFullscreen = ref(document.fullscreenElement === target)

  const enter = async (): Promise<void> => {
    if (!isSupported) return

    await target.requestFullscreen(options)

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
    useEventListener(
      document,
      'fullscreenchange',
      () => {
        isFullscreen.value = document.fullscreenElement === target
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
