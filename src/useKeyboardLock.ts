import { readonly, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

interface UseKeyboardLockReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * keyboard lock status
   */
  isKeyboardLock: Readonly<Ref<boolean>>

  /**
   * request keyboard lock
   */
  lock: () => Promise<void>

  /**
   * release keyboard lock
   */
  unlock: () => Promise<void>

  /**
   * trigger keyboard lock
   */
  trigger: () => Promise<void>
}

/**
 * reactive Pointer Lock API
 * @param keyCodes keyCodes using to lock
 * @returns @see {@link UseKeyboardLockReturn}
 */
const useKeyboardLock = (keyCodes: MaybeRefOrGetter<string[]> = []): UseKeyboardLockReturn => {
  const isSupported = 'KeyBoard' in window

  const isKeyboardLock = ref(false)

  const lock = async (): Promise<void> => {
    if (!isSupported) return

    await navigator.keyboard.lock(toValue(keyCodes))

    isKeyboardLock.value = true
  }

  const unlock = async (): Promise<void> => {
    if (!isSupported) return

    navigator.keyboard.unlock()

    isKeyboardLock.value = false
  }

  const trigger = async (): Promise<void> => {
    await (isKeyboardLock.value ? unlock() : lock())
  }

  return {
    isSupported,
    isKeyboardLock: readonly(isKeyboardLock),
    lock,
    unlock,
    trigger,
  }
}

export default useKeyboardLock
