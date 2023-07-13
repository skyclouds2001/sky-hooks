import { ref, watch } from 'vue'

const usePointerCapture = (target: HTMLElement = document.documentElement, id: number): any => {
  const isSupported = 'setPointerCapture' in Element.prototype && 'releasePointerCapture' in Element.prototype && 'hasPointerCapture' in Element.prototype

  const isPointerCapture = ref(target.hasPointerCapture(id))

  const set = (): void => {
    target.setPointerCapture(id)
    isPointerCapture.value = target.hasPointerCapture(id)
  }

  const release = (): void => {
    target.releasePointerCapture(id)
    isPointerCapture.value = target.hasPointerCapture(id)
  }

  const toggle = (): void => {
    isPointerCapture.value ? release() : set()
  }

  watch(isPointerCapture, (isPointerCapture) => {
    isPointerCapture ? set() : release()
  })

  return {
    isSupported,
    isPointerCapture,
    set,
    release,
    toggle,
  }
}

export default usePointerCapture
