import { reactive, ref, type Ref } from 'vue'
import { useEventListener } from '.'

const useKeyboard = (): Record<string, Ref<boolean>> & { current: Set<string> } => {
  const keys: Record<string, Ref<boolean>> & { current: Set<string> } = {
    current: reactive(new Set()),
  }

  const proxy = new Proxy(keys, {
    get: (target, prop, receiver) => {
      if (!Reflect.has(target, prop)) {
        Reflect.set(target, prop, ref(false))
      }
      return Reflect.get(target, prop, receiver)
    },
  })

  const updateKeys = (e: KeyboardEvent, mode: boolean) => {
    if (e.key in keys) {
      keys[e.key].value = true
    } else {
      keys[e.key] = ref(true)
    }

    if (mode) {
      keys.current.add(e.key)
    } else {
      keys.current.delete(e.key)
    }
  }

  useEventListener(window, 'keydown', (e) => {
    updateKeys(e, true)
  }, { passive: true })
  useEventListener(window, 'keyup', (e) => {
    updateKeys(e, false)
  }, { passive: true })

  return proxy
}

export default useKeyboard
