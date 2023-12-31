import { ref, shallowRef, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'

interface UseDocumentPictureInPictureOptions {
  /**
   * picture in picture window width
   * @default 0
   */
  width?: number

  /**
   * picture in picture window height
   * @default 0
   */
  height?: number
}

interface UseDocumentPictureInPictureReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * picture in picture status of the specified element
   */
  isDocumentPictureInPicture: DeepReadonly<Ref<boolean>>

  /**
   * picture-in-picture window of the specified element
   */
  pictureInPictureWindow: Readonly<ShallowRef<Window | null>>

  /**
   * enter picture in picture status of the specified element
   */
  enter: () => Promise<void>

  /**
   * exit picture in picture status of the specified element
   */
  exit: () => Promise<void>

  /**
   * toggle picture in picture status of the specified element
   */
  toggle: () => Promise<void>
}

/**
 * reactive Document Picture-in-Picture API
 * @param target control target
 * @param options @see {@link UseDocumentPictureInPictureOptions}
 * @returns @see {@link UseDocumentPictureInPictureReturn}
 */
const useDocumentPictureInPicture = (target: MaybeRefOrGetter<HTMLElement | null> = document.documentElement, options: UseDocumentPictureInPictureOptions = {}): UseDocumentPictureInPictureReturn => {
  const { width = 0, height = 0 } = options

  const isSupported = 'documentPictureInPicture' in window

  const isDocumentPictureInPicture = ref(false)

  const pictureInPictureWindow = shallowRef<Window | null>(null)

  let element: Element | null = null

  const enter = async (): Promise<void> => {
    if (!isSupported) return

    if (isDocumentPictureInPicture.value) return

    const el = toValue(target)

    if (el === null) return

    element = document.createElement('span')
    el.parentElement?.replaceChild(element, el)

    if (pictureInPictureWindow.value === null) {
      void window.documentPictureInPicture.requestWindow({
        width,
        height,
      })

      useEventListener(window.documentPictureInPicture, 'enter', (e) => {
        isDocumentPictureInPicture.value = true

        const win = (e as DocumentPictureInPictureEvent).window

        win.document.body.appendChild(el)

        pictureInPictureWindow.value = win

        useEventListener(win, 'pagehide', () => {
          element?.parentElement?.replaceChild(el, element)

          element = null

          pictureInPictureWindow.value = null
        })
      })
    } else {
      pictureInPictureWindow.value.document.body.appendChild(el)
    }
  }

  const exit = async (): Promise<void> => {
    if (!isSupported) return

    if (!isDocumentPictureInPicture.value) return

    if (pictureInPictureWindow.value !== null) {
      pictureInPictureWindow.value.close()
      isDocumentPictureInPicture.value = false
    }
  }

  const toggle = async (): Promise<void> => {
    if (!isSupported) return

    await (isDocumentPictureInPicture.value ? exit() : enter())
  }

  if (isSupported) {
    watch(
      () => toValue(target),
      (target) => {
        if (target === null) return

        void (isDocumentPictureInPicture.value ? enter() : exit())
      },
      {
        immediate: true,
      }
    )
  }

  return {
    isSupported,
    isDocumentPictureInPicture,
    pictureInPictureWindow,
    enter,
    exit,
    toggle,
  }
}

export default useDocumentPictureInPicture
