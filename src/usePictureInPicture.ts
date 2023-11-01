import { type MaybeRefOrGetter, readonly, ref, type Ref, shallowReadonly, toValue, watch } from 'vue'
import { useEventListener } from '.'

interface UsePictureInPictureReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * picture-in-picture status of the specified element
   */
  isPictureInPicture: Readonly<Ref<boolean>>

  /**
   * picture-in-picture window of the specified element
   */
  pictureInPictureWindow: Readonly<Ref<PictureInPictureWindow | null>>

  /**
   * enter picture-in-picture status of the specified element
   */
  enter: () => Promise<void>

  /**
   * exit picture-in-picture status of the specified element
   */
  exit: () => Promise<void>

  /**
   * toggle picture-in-picture status of the specified element
   */
  toggle: () => Promise<void>
}

/**
 * reactive Picture-in-Picture API
 * @param target control target
 * @returns @see {@link UsePictureInPictureReturn}
 */
const usePictureInPicture = (target: MaybeRefOrGetter<HTMLVideoElement | null>): UsePictureInPictureReturn => {
  const isSupported = 'pictureInPictureElement' in document && 'requestPictureInPicture' in HTMLVideoElement.prototype && 'exitPictureInPicture' in document && document.pictureInPictureEnabled

  const isPictureInPicture = ref(document.pictureInPictureElement === toValue(target) && document.pictureInPictureElement != null)

  const pictureInPictureWindow = ref<PictureInPictureWindow | null>(null)

  const enter = async (): Promise<void> => {
    if (!isSupported) return

    if (document.pictureInPictureElement != null) return

    const window = await toValue(target)?.requestPictureInPicture()

    pictureInPictureWindow.value = window ?? null

    isPictureInPicture.value = true
  }

  const exit = async (): Promise<void> => {
    if (!isSupported) return

    if (document.pictureInPictureElement == null) return

    await document.exitPictureInPicture()

    pictureInPictureWindow.value = null

    isPictureInPicture.value = false
  }

  const toggle = async (): Promise<void> => {
    if (!isSupported) return

    await (isPictureInPicture.value ? exit() : enter())
  }

  if (isSupported) {
    watch(
      () => toValue(target),
      (target) => {
        if (target === null) return

        void (isPictureInPicture.value ? enter() : exit())

        useEventListener<HTMLVideoElement, HTMLVideoElementEventMap, 'enterpictureinpicture'>(target, 'enterpictureinpicture', () => {
          isPictureInPicture.value = document.pictureInPictureElement === target && document.pictureInPictureElement !== null
        })

        useEventListener<HTMLVideoElement, HTMLVideoElementEventMap, 'leavepictureinpicture'>(target, 'leavepictureinpicture', () => {
          isPictureInPicture.value = document.pictureInPictureElement === target && document.pictureInPictureElement !== null
        })
      },
      {
        immediate: true,
      }
    )
  }

  return {
    isSupported,
    isPictureInPicture: readonly(isPictureInPicture),
    pictureInPictureWindow: shallowReadonly(pictureInPictureWindow),
    enter,
    exit,
    toggle,
  }
}

export default usePictureInPicture
