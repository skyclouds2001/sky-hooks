import { type MaybeRefOrGetter, readonly, ref, type Ref, shallowReadonly, toValue, watch } from 'vue'
import { useEventListener } from '.'

const usePictureInPicture = (
  target: MaybeRefOrGetter<HTMLVideoElement | null>
): {
  isSupported: boolean
  isPictureInPicture: Readonly<Ref<boolean>>
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

  if (isSupported) {
    watch(
      () => toValue(target),
      (target) => {
        if (target === null) return

        void (isPictureInPicture.value ? enter() : exit())

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
