import { readonly, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UsePointerLockReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * pointer lock status
   */
  isPointerLock: Readonly<Ref<boolean>>

  /**
   * request pointer lock of the specified element
   */
  lock: () => void

  /**
   * release pointer lock of the specified element
   */
  unlock: () => void

  /**
   * trigger pointer lock of the specified element
   */
  trigger: () => void
}

/**
 * reactive Pointer Lock API
 * @param target control target
 * @param onError optional handle to call if pointer lock fail
 * @returns @see {@link UsePointerLockReturn}
 */
const usePointerLock = (target: MaybeRefOrGetter<Element | null> = document.documentElement, onError?: (e: Event) => void): UsePointerLockReturn => {
  const isSupported = 'pointerLockElement' in document && 'requestPointerLock' in Element.prototype && 'exitPointerLock' in document

  const isPointerLock = ref(document.pointerLockElement === toValue(target) && document.pointerLockElement != null)

  const lock = (): void => {
    if (!isSupported) return

    if (document.pointerLockElement != null) return

    toValue(target)?.requestPointerLock()

    isPointerLock.value = true
  }

  const unlock = (): void => {
    if (!isSupported) return

    if (document.pointerLockElement != null) return

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

    useEventListener(document, 'pointerlockchange', () => {
      isPointerLock.value = document.pointerLockElement === toValue(target)
    })

    if (onError !== undefined) {
      useEventListener(document, 'pointerlockerror', onError)
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
