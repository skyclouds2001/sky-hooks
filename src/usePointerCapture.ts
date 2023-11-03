import { readonly, ref, toValue, watch, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue'

const usePointerCapture = (
  target: MaybeRefOrGetter<HTMLElement | null> = document.documentElement,
  id: number
): {
  isSupported: boolean
  isPointerCapture: DeepReadonly<Ref<boolean>>
  set: () => void
  release: () => void
  toggle: () => void
} => {
  const isSupported = 'setPointerCapture' in Element.prototype && 'releasePointerCapture' in Element.prototype && 'hasPointerCapture' in Element.prototype

  const isPointerCapture = ref(toValue(target)?.hasPointerCapture(id) ?? false)

  const set = (): void => {
    toValue(target)?.setPointerCapture(id)

    isPointerCapture.value = true
  }

  const release = (): void => {
    toValue(target)?.releasePointerCapture(id)

    isPointerCapture.value = false
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
      },
      {
        immediate: true,
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
