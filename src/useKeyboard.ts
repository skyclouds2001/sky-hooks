import { reactive, ref, type Ref } from 'vue'
import useEventListener from './useEventListener'

/**
 * default alias map to use
 */
export const DEFAULT_ALIASES_MAP = {
  ctrl: 'control',
  command: 'meta',
  cmd: 'meta',
  option: 'alt',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
} as const

/**
 * a constant for using current pressed keyboard codes
 */
export const current = Symbol('current')

interface UseKeyboardOptions {
  /**
   * the aliases map to use, will overwrite the default aliases map
   * @default {}
   */
  aliasMap?: Record<string, string>
}

type UseKeyboardReturn = Readonly<Record<string, Readonly<Ref<boolean>>> & { [current]: ReadonlySet<string> }>

/**
 * reactive key code of keyboard
 * @param options @see {@link UseKeyboardOptions}
 * @returns @see {@link UseKeyboardReturn}
 */
const useKeyboard = (options: UseKeyboardOptions = {}): UseKeyboardReturn => {
  const { aliasMap = {} } = options

  const aliases = Object.assign({}, DEFAULT_ALIASES_MAP, aliasMap)

  const keys: Record<string, Ref<boolean>> & { [current]: Set<string> } = {
    [current]: reactive(new Set()),
  }

  const updateKeys = (e: KeyboardEvent, mode: boolean): void => {
    if (e.key in keys) {
      keys[e.key].value = true
    } else {
      keys[e.key] = ref(true)
    }

    if (mode) {
      keys[current].add(e.key)
    } else {
      keys[current].delete(e.key)
    }
  }

  useEventListener(window, 'keydown', (e) => {
    updateKeys(e, true)
  })

  useEventListener(window, 'keyup', (e) => {
    updateKeys(e, false)
  })

  const reset = (): void => {
    keys[current].clear()
    Object.entries(keys).forEach(([_, value]) => {
      value.value = false
    })
  }

  useEventListener(window, 'focus', reset)

  useEventListener(window, 'blur', reset)

  return new Proxy(keys, {
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
}

export default useKeyboard
