import { computed, shallowReadonly, shallowRef, type ComputedRef, type ShallowRef } from 'vue'
import useEventListener from './useEventListener'

interface UseSelectionReturn {
  /**
   * selection object
   */
  selection: Readonly<ShallowRef<Selection | null>>

  /**
   * selection text
   */
  text: ComputedRef<string>

  /**
   * selection ranges
   */
  ranges: ComputedRef<Range[]>

  /**
   * selection rects
   */
  rects: ComputedRef<DOMRect[]>
}

/**
 * reactive selection
 * @returns @see {@link UseSelectionReturn}
 */
const useSelection = (): {
  selection: Readonly<ShallowRef<Selection | null>>
  text: ComputedRef<string>
  ranges: ComputedRef<Range[]>
  rects: ComputedRef<DOMRect[]>
} => {
  const selection = shallowRef<Selection | null>(null)

  const text = computed(() => selection.value?.toString() ?? '')

  const ranges = computed(() =>
    selection.value !== null
      ? (Array(selection.value.rangeCount)
          .fill(0)
          .map((_, i) => selection.value?.getRangeAt(i)) as Range[])
      : []
  )

  const rects = computed(() => ranges.value.map((range) => range.getBoundingClientRect()))

  useEventListener(document, 'selectionchange', () => {
    selection.value = window.getSelection()
  })

  return {
    selection: shallowReadonly(selection),
    text,
    rects,
    ranges,
  }
}

export default useSelection
