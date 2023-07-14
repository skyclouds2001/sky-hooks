import { ref, type Ref, watch } from 'vue'

const usePointerCapture = (
  target: HTMLElement = document.documentElement,
  id: number
): {
  isSupported: boolean
  isPointerCapture: Ref<boolean>
  set: () => void
  release: () => void
  toggle: () => void
} => {
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

  if (isSupported) {
    watch(isPointerCapture, (isPointerCapture) => {
      isPointerCapture ? set() : release()
    })
  }

  return {
    isSupported,
    isPointerCapture,
    set,
    release,
    toggle,
  }
}

export default usePointerCapture
