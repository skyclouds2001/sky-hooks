import { readonly, ref, shallowReadonly, shallowRef, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'

interface UsePictureInPictureReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * picture-in-picture status of the specified element
   */
  isPictureInPicture: DeepReadonly<Ref<boolean>>

  /**
   * picture-in-picture window of the specified element
   */
  pictureInPictureWindow: Readonly<ShallowRef<PictureInPictureWindow | null>>

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

  const pictureInPictureWindow = shallowRef<PictureInPictureWindow | null>(null)

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

        useEventListener(target, 'enterpictureinpicture', () => {
          isPictureInPicture.value = document.pictureInPictureElement === target && document.pictureInPictureElement !== null
        })

        useEventListener(target, 'leavepictureinpicture', () => {
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
