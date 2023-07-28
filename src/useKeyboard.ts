import { reactive, ref, type Ref } from 'vue'
import { useEventListener } from '.'

const DefaultAliasMap = {
  ctrl: 'control',
  command: 'meta',
  cmd: 'meta',
  option: 'alt',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
}

const current = Symbol('current')

const useKeyboard = (
  options: {
    aliasMap?: Record<string, string>
    passive?: boolean
    onEventFired?: (e: KeyboardEvent) => void
  } = {}
): Readonly<Record<string, Readonly<Ref<boolean>>> & { [current]: ReadonlySet<string> }> => {
  const { aliasMap = {}, passive = true, onEventFired } = options

  const aliases = Object.assign({}, aliasMap, DefaultAliasMap)

  const keys: Record<string, Ref<boolean>> & { [current]: Set<string> } = {
    [current]: reactive(new Set()),
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

  const updateKeys = (e: KeyboardEvent, mode: boolean): void => {
    if (e.key in keys) {
      keys[e.key].value = true
    } else {
      keys[e.key] = ref(true)
    }

    if (mode) {
      // eslint-disable-next-line security/detect-object-injection
      keys[current].add(e.key)
    } else {
      // eslint-disable-next-line security/detect-object-injection
      keys[current].delete(e.key)
    }
  }

  useEventListener(
    window,
    'keydown',
    (e) => {
      updateKeys(e, true)
      onEventFired?.(e)
    },
    { passive }
  )

  useEventListener(
    window,
    'keyup',
    (e) => {
      updateKeys(e, false)
      onEventFired?.(e)
    },
    { passive }
  )

  const reset = (): void => {
    // eslint-disable-next-line security/detect-object-injection
    keys[current].clear()
    Object.entries(keys).forEach(([_, value]) => {
      value.value = false
    })
  }

  useEventListener(window, 'focus', reset, { passive: true })

  useEventListener(window, 'blur', reset, { passive: true })

  return proxy
}

export default useKeyboard
