import { readonly, ref, type Ref } from 'vue'

const usePointerCapture = (
  target: HTMLElement = document.documentElement,
  id: number
): {
  isSupported: boolean
  isPointerCapture: Readonly<Ref<boolean>>
  set: () => void
  release: () => void
  toggle: () => void
} => {
  const isSupported = 'setPointerCapture' in Element.prototype && 'releasePointerCapture' in Element.prototype && 'hasPointerCapture' in Element.prototype

  const isPointerCapture = ref(target.hasPointerCapture(id))

  const set = (): void => {
    target.setPointerCapture(id)

    isPointerCapture.value = true
  }

  const release = (): void => {
    target.releasePointerCapture(id)

    isPointerCapture.value = false
  }

  const toggle = (): void => {
    isPointerCapture.value ? release() : set()
  }

  return {
    isSupported,
    isPointerCapture: readonly(isPointerCapture),
    set,
    release,
    toggle,
  }
}

export default usePointerCapture
