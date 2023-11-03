import { readonly, ref, type DeepReadonly, type Ref } from 'vue'
import useEventListener from './useEventListener'

interface UseMouseOptions {
  /**
   * mouse control target
   * @default window
   */
  target?: HTMLElement | SVGElement | MathMLElement | Document | Window

  /**
   * mouse position type
   * @default 'client'
   */
  type?: 'client' | 'offset' | 'page' | 'screen' | ((e: MouseEvent) => [x: number, y: number])
}

interface UseMouseReturn {
  /**
   * x coordinate of mouse
   */
  x: DeepReadonly<Ref<number>>

  /**
   * y coordinate of mouse
   */
  y: DeepReadonly<Ref<number>>

  /**
   * whether the mouse is pressed
   */
  pressed: DeepReadonly<Ref<boolean>>
}

/**
 * reactive mouse information of mouse
 * @param options @see {@link UseMouseOptions}
 * @returns @see {@link UseMouseReturn}
 */
const useMouse = (options: UseMouseOptions = {}): UseMouseReturn => {
  const { target = window, type = 'client' } = options

  const x = ref(0)
  const y = ref(0)
  const pressed = ref(false)

  useEventListener(target, 'mousemove', (e: MouseEvent) => {
    if (typeof type === 'function') {
      const [mx, my] = type(e)
      x.value = mx
      y.value = my
    } else {
      switch (type) {
        case 'client':
          x.value = e.clientX
          y.value = e.clientY
          break
        case 'offset':
          x.value = e.offsetX
          y.value = e.offsetY
          break
        case 'page':
          x.value = e.pageX
          y.value = e.pageY
          break
        case 'screen':
          x.value = e.screenX
          y.value = e.screenY
          break
      }
    }
  })

  useEventListener(target, 'mousedown', () => {
    pressed.value = true
  })

  useEventListener(target, 'mouseup', () => {
    pressed.value = false
  })

  return {
    x: readonly(x),
    y: readonly(y),
    pressed: readonly(pressed),
  }
}

export default useMouse
