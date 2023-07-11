import { ref } from 'vue'
import { useEventListener } from '.'

const useMouse = (options: {
  target?: HTMLElement | SVGElement | MathMLElement | Document | Window
  type?: 'client' | 'offset' | 'page' | 'screen' | ((e: MouseEvent) => [x: number, y: number])
} = {}): any => {
  const { target = window, type = 'client' } = options

  const x = ref(0)
  const y = ref(0)
  const pressed = ref(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (typeof type === 'function') {
      const pos = type(e)
      x.value = pos[0]
      y.value = pos[1]
    } else {
      switch(type) {
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
  }

  useEventListener(target, 'mousemove', handleMouseMove, { passive: true })

  const handleMouseDown = () => {
    pressed.value = true
  }

  const handleMouseUp = () => {
    pressed.value = false
  }

  useEventListener(target, 'mousedown', handleMouseDown, { passive: true })
  useEventListener(target, 'mouseup', handleMouseUp, { passive: true })

  return {
    x,
    y,
    pressed,
  }
}

export default useMouse