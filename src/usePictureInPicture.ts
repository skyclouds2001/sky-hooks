import { type MaybeRefOrGetter, readonly, ref, type Ref, toValue, watch } from 'vue'
import { useEventListener } from '.'

const usePictureInPicture = (
  target: MaybeRefOrGetter<HTMLVideoElement | null>
): {
  isSupported: boolean
  isPictureInPicture: Ref<boolean>
  pictureInPictureWindow: Readonly<Ref<PictureInPictureWindow | null>>
  enter: () => Promise<void>
  exit: () => Promise<void>
  toggle: () => Promise<void>
} => {
  const isSupported = 'pictureInPictureElement' in document && 'requestPictureInPicture' in HTMLVideoElement.prototype && 'exitPictureInPicture' in document && document.pictureInPictureEnabled

  const isPictureInPicture = ref(document.pictureInPictureElement === toValue(target) && document.pictureInPictureElement !== null)

  const pictureInPictureWindow = ref<PictureInPictureWindow | null>(null)

  const enter = async (): Promise<void> => {
    if (!isSupported) return

    const window = await toValue(target)?.requestPictureInPicture()
    pictureInPictureWindow.value = window ?? null

    isPictureInPicture.value = true
  }

  const exit = async (): Promise<void> => {
    if (!isSupported) return

    await document.exitPictureInPicture()
    pictureInPictureWindow.value = null

    isPictureInPicture.value = false
  }

  const toggle = async (): Promise<void> => {
    await (isPictureInPicture.value ? exit() : enter())
  }

  watch(isPictureInPicture, (isPictureInPicture) => {
    void (isPictureInPicture ? enter() : exit())
  })

  watch(
    () => toValue(target),
    (target) => {
      if (!isSupported) return

      if (target === null) return

      useEventListener<HTMLVideoElement, HTMLVideoElementEventMap, 'enterpictureinpicture'>(
        target,
        'enterpictureinpicture',
        () => {
          isPictureInPicture.value = document.pictureInPictureElement === target && document.pictureInPictureElement !== null
        },
        {
          passive: true,
        }
      )

      useEventListener<HTMLVideoElement, HTMLVideoElementEventMap, 'leavepictureinpicture'>(
        target,
        'leavepictureinpicture',
        () => {
          isPictureInPicture.value = document.pictureInPictureElement === target && document.pictureInPictureElement !== null
        },
        {
          passive: true,
        }
      )
    },
    {
      immediate: true,
    }
  )

  return {
    isSupported,
    isPictureInPicture,
    pictureInPictureWindow: readonly(pictureInPictureWindow),
    enter,
    exit,
    toggle,
  }
}

export default usePictureInPicture
