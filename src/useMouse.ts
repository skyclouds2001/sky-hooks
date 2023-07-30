import { ref, type Ref } from 'vue'
import { useEventListener } from '.'

const useMouse = (
  options: {
    target?: HTMLElement | SVGElement | MathMLElement | Document | Window
    type?: 'client' | 'offset' | 'page' | 'screen' | ((e: MouseEvent) => [x: number, y: number])
    passive?: boolean
  } = {}
): {
  x: Readonly<Ref<number>>
  y: Readonly<Ref<number>>
  pressed: Readonly<Ref<boolean>>
} => {
  const { target = window, type = 'client', passive = true } = options

  const x = ref(0)
  const y = ref(0)
  const pressed = ref(false)

  useEventListener(
    target,
    'mousemove',
    (e: MouseEvent) => {
      if (typeof type === 'function') {
        const pos = type(e)
        x.value = pos[0]
        y.value = pos[1]
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
    },
    {
      passive,
    }
  )

  useEventListener(
    target,
    'mousedown',
    () => {
      pressed.value = true
    },
    {
      passive,
    }
  )

  useEventListener(
    target,
    'mouseup',
    () => {
      pressed.value = false
    },
    {
      passive,
    }
  )

  return {
    x,
    y,
    pressed,
  }
}

export default useMouse
