import { type MaybeRefOrGetter, readonly, ref, type Ref, toValue, watch } from 'vue'
import { useEventListener } from '.'

const usePointerLock = (
  target: MaybeRefOrGetter<HTMLElement | null> = document.documentElement,
  options?: {
    unadjustedMovement: boolean
  },
  onError?: (e: Event) => void
): {
  isSupported: boolean
  isPointerLock: Readonly<Ref<boolean>>
  lock: () => void
  unlock: () => void
  trigger: () => void
} => {
  const isSupported = 'pointerLockElement' in document && 'requestPointerLock' in Element.prototype && 'exitPointerLock' in document

  const isPointerLock = ref(document.pointerLockElement === toValue(target) && document.pointerLockElement != null)

  const lock = (): void => {
    if (!isSupported) return

    // @ts-expect-error unsupported function param
    toValue(target)?.requestPointerLock(options)

    isPointerLock.value = true
  }

  const unlock = (): void => {
    if (!isSupported) return

    document.exitPointerLock()

    isPointerLock.value = false
  }

  const trigger = (): void => {
    isPointerLock.value ? unlock() : lock()
  }

  if (isSupported) {
    watch(
      () => toValue(target),
      (target) => {
        if (target === null) return

        isPointerLock.value ? lock() : unlock()
      },
      {
        immediate: true,
      }
    )

    useEventListener(
      document,
      'pointerlockchange',
      () => {
        isPointerLock.value = document.pointerLockElement === toValue(target)
      },
      {
        passive: true,
      }
    )

    if (onError !== undefined) {
      useEventListener(document, 'pointerlockerror', onError, {
        passive: true,
      })
    }
  }

  return {
    isSupported,
    isPointerLock: readonly(isPointerLock),
    lock,
    unlock,
    trigger,
  }
}

export default usePointerLock
