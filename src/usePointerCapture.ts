import { readonly, ref, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue'

interface UsePointerCaptureReturn {
  /**
   * API support status
   */
  isSupported: boolean

  /**
   * pointer capture status
   */
  isPointerCapture: DeepReadonly<Ref<boolean>>

  /**
   * set pointer capture of the specified element
   */
  set: () => void

  /**
   * release pointer capture of the specified element
   */
  release: () => void

  /**
   * toggle pointer capture of the specified element
   */
  toggle: () => void
}

/**
 * reactive pointer capture
 * @param target pointer capture target
 * @param id pointer id
 * @returns @see {@link UsePointerCaptureReturn}
 */
const usePointerCapture = (target: MaybeRefOrGetter<HTMLElement | null> = document.documentElement, id: number): UsePointerCaptureReturn => {
  const isSupported = 'setPointerCapture' in Element.prototype && 'releasePointerCapture' in Element.prototype && 'hasPointerCapture' in Element.prototype

  const isPointerCapture = ref(toValue(target)?.hasPointerCapture(id) ?? false)

  const set = (): void => {
    toValue(target)?.setPointerCapture(id)

    isPointerCapture.value = toValue(target)?.hasPointerCapture(id) ?? false
  }

  const release = (): void => {
    toValue(target)?.releasePointerCapture(id)

    isPointerCapture.value = toValue(target)?.hasPointerCapture(id) ?? false
  }

  const toggle = (): void => {
    isPointerCapture.value ? release() : set()
  }

  if (isSupported) {
    watch(
      () => toValue(target),
      (target) => {
        if (target === null) return

        isPointerCapture.value ? set() : release()
      }
    )
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
