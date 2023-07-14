import { ref, type Ref, watch } from 'vue'
import { useEventListener } from '.'

const usePointerLock = (
  target: HTMLElement = document.documentElement,
  options?: {
    unadjustedMovement: boolean
  },
  onError?: (e: Event) => void
): {
  isSupported: boolean
  isPointerLock: Ref<boolean>
  lock: () => void
  unlock: () => void
  trigger: () => void
} => {
  const isSupported = 'pointerLockElement' in document && 'requestPointerLock' in Element.prototype && 'exitPointerLock' in document

  const isPointerLock = ref(document.pointerLockElement === target)

  const lock = (): void => {
    if (!isSupported) return

    // @ts-expect-error 尚未支持的函数参数
    target.requestPointerLock(options)

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
    watch(isPointerLock, (isPointerLock) => {
      isPointerLock ? lock() : unlock()
    })

    useEventListener(
      document,
      'pointerlockchange',
      () => {
        isPointerLock.value = document.pointerLockElement === target
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
    isPointerLock,
    lock,
    unlock,
    trigger,
  }
}

export default usePointerLock
