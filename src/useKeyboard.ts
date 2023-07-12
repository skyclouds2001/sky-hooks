import { reactive, ref, type Ref } from 'vue'
import { useEventListener } from '.'

const defaultAliasMap = {
  ctrl: 'control',
  command: 'meta',
  cmd: 'meta',
  option: 'alt',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
}

const useKeyboard = (options: {
  aliasMap?: Record<string, string>
} = {}): Readonly<Record<string, Ref<boolean>> & { current: ReadonlySet<string> }> => {
  const { aliasMap = {} } = options

  const aliases = Object.assign({}, aliasMap, defaultAliasMap)

  const keys: Record<string, Ref<boolean>> & { current: Set<string> } = {
    current: reactive(new Set()),
  }

  const proxy = new Proxy(keys, {
    get: (target, prop, receiver) => {
      if (prop in aliases && typeof prop === 'string') {
        prop = aliases[prop]
      }

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
