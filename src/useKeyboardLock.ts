import { readonly, ref, type Ref } from 'vue'

const useKeyboardLock = (
  options: {
    keys?: string[]
  } = {}
): {
  isSupported: boolean
  isKeyboardLock: Readonly<Ref<boolean>>
  lock: () => Promise<void>
  unlock: () => Promise<void>
  trigger: () => Promise<void>
} => {
  const { keys } = options

  const isSupported = 'KeyBoard' in window

  const isKeyboardLock = ref(false)

  const lock = async (): Promise<void> => {
    if (!isSupported) return

    await navigator.keyboard.lock(keys)

    isKeyboardLock.value = true
  }

  const unlock = async (): Promise<void> => {
    if (!isSupported) return

    await navigator.keyboard.unlock()

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
